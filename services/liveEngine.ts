
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createBlob, decodeAudioData, decode } from './audioProcessing';
import { startAudioCapture, stopAudioCapture } from './audioService';
import { useAppStore } from '../store/useAppStore';

const PCM_WORKLET_CODE = `
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.index = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0];
      for (let i = 0; i < channelData.length; i++) {
        this.buffer[this.index++] = channelData[i];
        if (this.index >= this.bufferSize) {
          this.port.postMessage(this.buffer);
          this.index = 0;
        }
      }
    }
    return true;
  }
}
registerProcessor('pcm-processor', PCMProcessor);
`;

type LiveStatus = 'idle' | 'connecting' | 'connected' | 'error';

interface LiveEngineCallbacks {
  onStatusChange: (status: LiveStatus) => void;
  onVolumeUpdate: (level: number) => void;
  onSpeakingChanged: (isSpeaking: boolean) => void;
  onError: (error: Error) => void;
}

export class LiveEngine {
  private status: LiveStatus = 'idle';
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private outputNode: GainNode | null = null;
  private activeSources = new Set<AudioBufferSourceNode>();
  private nextStartTime = 0;
  private session: any = null;
  private workletUrl: string | null = null;

  constructor(private callbacks: LiveEngineCallbacks) {}

  public async connect(systemInstruction: string, voiceName: string) {
    if (this.status === 'connected' || this.status === 'connecting') return;
    
    this.setStatus('connecting');

    try {
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      // 1. Audio Output Setup
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass({ sampleRate: 24000 });
      
      this.outputNode = this.audioContext.createGain();
      this.outputNode.connect(this.audioContext.destination);

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // 2. Audio Input Setup (Central Service)
      const stream = await startAudioCapture(false);
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const source = inputCtx.createMediaStreamSource(stream);

      // 3. Audio Worklet Setup
      const blob = new Blob([PCM_WORKLET_CODE], { type: "application/javascript" });
      this.workletUrl = URL.createObjectURL(blob);
      await inputCtx.audioWorklet.addModule(this.workletUrl);

      this.workletNode = new AudioWorkletNode(inputCtx, 'pcm-processor');
      source.connect(this.workletNode);
      this.workletNode.connect(inputCtx.destination);

      // 4. Gemini Session
      const sessionPromise = ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction,
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
        },
        callbacks: {
          onopen: () => {
            this.setStatus('connected');
            this.setupWorkletMessaging(sessionPromise);
          },
          onmessage: (msg: LiveServerMessage) => this.handleMessage(msg),
          onclose: () => this.disconnect(),
          onerror: (err) => {
            console.error(err);
            this.callbacks.onError(new Error("Connection error"));
            this.disconnect();
          }
        }
      });

      const session = await sessionPromise;
      
      // Race Condition Check: If user disconnected while connecting
      if (this.status === 'idle') {
          session.close();
          return;
      }
      this.session = session;

    } catch (error: any) {
      this.callbacks.onError(error);
      this.disconnect();
    }
  }

  private setupWorkletMessaging(sessionPromise: Promise<any>) {
    if (!this.workletNode) return;

    this.workletNode.port.onmessage = (event) => {
      const inputData = event.data as Float32Array;
      
      // Volume calculation
      let maxVal = 0;
      for(let i=0; i<inputData.length; i++) {
        const abs = Math.abs(inputData[i]);
        if(abs > maxVal) maxVal = abs;
      }
      this.callbacks.onVolumeUpdate(maxVal);

      // Send to Gemini
      const pcmBlob = createBlob(inputData);
      sessionPromise.then((session) => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };
  }

  private async handleMessage(msg: LiveServerMessage) {
    const interrupted = msg.serverContent?.interrupted;
    if (interrupted) {
      this.stopAllAudio();
      this.nextStartTime = 0;
      this.callbacks.onSpeakingChanged(false);
      return;
    }

    const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (audioData && this.audioContext && this.outputNode) {
      this.callbacks.onSpeakingChanged(true);
      
      const buffer = await decodeAudioData(decode(audioData), this.audioContext);
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.outputNode);
      
      // Apply voice speed from store
      const speed = useAppStore.getState().voiceSpeed || 1.0;
      source.playbackRate.value = speed;

      this.activeSources.add(source);

      this.nextStartTime = Math.max(this.nextStartTime, this.audioContext.currentTime);
      source.start(this.nextStartTime);
      
      // Adjust duration calculation based on speed
      this.nextStartTime += buffer.duration / speed;

      source.addEventListener('ended', () => {
        this.activeSources.delete(source);
        if (this.audioContext && this.audioContext.currentTime >= this.nextStartTime) {
           this.callbacks.onSpeakingChanged(false);
        }
      });
    }
  }

  private stopAllAudio() {
    this.activeSources.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    this.activeSources.clear();
  }

  public disconnect() {
    if (this.status === 'idle') return;

    this.stopAllAudio();
    stopAudioCapture();

    if (this.workletNode) {
        try { this.workletNode.disconnect(); } catch {}
        this.workletNode = null;
    }
    if (this.outputNode) {
        try { this.outputNode.disconnect(); } catch {}
        this.outputNode = null;
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close().catch(() => {});
    }
    this.audioContext = null;

    if (this.session) {
        const s = this.session;
        this.session = null; 
        try { s.close(); } catch {}
    }

    if (this.workletUrl) {
        URL.revokeObjectURL(this.workletUrl);
        this.workletUrl = null;
    }

    this.setStatus('idle');
    this.callbacks.onVolumeUpdate(0);
    this.callbacks.onSpeakingChanged(false);
  }

  private setStatus(s: LiveStatus) {
    this.status = s;
    this.callbacks.onStatusChange(s);
  }
}
