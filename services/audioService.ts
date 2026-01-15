export interface AudioStreamState {
    micStream: MediaStream | null;
    systemStream: MediaStream | null;
    mixedStream: MediaStream | null;
    audioContext: AudioContext | null;
    mediaRecorder: MediaRecorder | null;
}
  
let currentState: AudioStreamState = {
    micStream: null,
    systemStream: null,
    mixedStream: null,
    audioContext: null,
    mediaRecorder: null
};

/**
 * Audio Capture Engine v1.9.9
 * Optimized for mandatory hardware release and re-initialization.
 */
export const startAudioCapture = async (includeSystem: boolean = false): Promise<MediaStream> => {
    try {
        // Close existing context if it exists to prevent browser limits
        if (currentState.audioContext) {
            await currentState.audioContext.close().catch(() => {});
        }

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        const destination = audioContext.createMediaStreamDestination();

        const audioConstraints = {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 1
        };

        const micStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
        const micSource = audioContext.createMediaStreamSource(micStream);
        micSource.connect(destination);

        let systemStream: MediaStream | null = null;
        if (includeSystem) {
            try {
                systemStream = await navigator.mediaDevices.getDisplayMedia({ 
                    video: { width: 1, height: 1 }, 
                    audio: { echoCancellation: false, autoGainControl: true, noiseSuppression: false } 
                });
                
                if (systemStream && systemStream.getAudioTracks().length > 0) {
                    const systemSource = audioContext.createMediaStreamSource(systemStream);
                    systemSource.connect(destination);
                }
            } catch (err: any) {
                console.warn("[Audio] System capture cancelled or rejected.");
            }
        }

        currentState = {
            micStream,
            systemStream,
            mixedStream: destination.stream,
            audioContext,
            mediaRecorder: null
        };

        return destination.stream;
    } catch (error) {
        console.error("[Audio] Hardware lock failed:", error);
        throw error;
    }
};

export const stopAudioCapture = () => {
    const { micStream, systemStream, audioContext } = currentState;
    
    // v1.9.9: HARD KILL tracks to force release mic hardware immediately
    if (micStream) {
        micStream.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
        });
    }
    if (systemStream) {
        systemStream.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
        });
    }
    
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(() => {});
    }

    currentState = { micStream: null, systemStream: null, mixedStream: null, audioContext: null, mediaRecorder: null };
};

export const createRecorder = (stream: MediaStream, onDataAvailable: (blob: Blob) => void): MediaRecorder => {
    const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac'];
    const selectedType = types.find(type => MediaRecorder.isTypeSupported(type)) || '';
    const options: MediaRecorderOptions = { audioBitsPerSecond: 32000 };
    if (selectedType) options.mimeType = selectedType;
    
    const recorder = new MediaRecorder(stream, options);
    let chunks: Blob[] = [];
    
    recorder.ondataavailable = (e) => { 
        if (e.data && e.data.size > 0) chunks.push(e.data); 
    };
    
    recorder.onstop = () => { 
        const finalBlob = new Blob(chunks, { type: selectedType || 'audio/webm' });
        onDataAvailable(finalBlob); 
        chunks = []; 
    };
    
    return recorder;
};