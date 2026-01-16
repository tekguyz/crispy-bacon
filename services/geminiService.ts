
import { GoogleGenAI, Type } from "@google/genai";
import { InsightContent, ContentType, Sentiment, InsightTemplate, PersonaStyle } from "../types";
import { getEffectiveMimeType } from "../utils/signalUtils";

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
    topics: { type: Type.ARRAY, items: { type: Type.STRING } },
    entities: { type: Type.ARRAY, items: { type: Type.STRING } },
    action_items: { type: Type.ARRAY, items: { type: Type.STRING } },
    sentiment: { type: Type.STRING, enum: ["POSITIVE", "NEUTRAL", "NEGATIVE", "COMPLEX"] },
    reading_time: { type: Type.INTEGER },
    momentum_score: { type: Type.INTEGER },
    friction: { type: Type.STRING },
    discussion_points: { type: Type.STRING }
  },
  required: ["title", "summary", "highlights", "topics", "entities", "action_items", "sentiment", "reading_time", "discussion_points", "momentum_score", "friction"],
};

export const analyzeContent = async (
  input: string, 
  type: ContentType, 
  userNotes: string, 
  template: InsightTemplate,
  isPro: boolean,
  persona: PersonaStyle,
  audioData?: string,
  audioMimeType?: string,
  durationSeconds?: number
): Promise<Partial<InsightContent>> => {
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const isComplex = (durationSeconds && durationSeconds > 600) || input.length > 25000;
  const modelName = (isPro && persona === PersonaStyle.DEEP_RESEARCH && isComplex) 
    ? 'gemini-3-pro-preview' 
    : 'gemini-3-flash-preview';

  const instructions = `
    ROLE: Elite Senior Research Strategist.
    TASK: Recover signal from raw capture.
    USER_GOAL: ${userNotes || 'Standard Strategic Recap'}.
    FOCUS: ${template}.
    
    STANDARDS: SKELETAL INTELLIGENCE. Ban conversational lubricant. Direct assertion.
  `;

  const effectiveMimeType = audioData ? getEffectiveMimeType(audioMimeType || '', 'audio.file') : undefined;

  const contents = audioData ? {
    parts: [
      { inlineData: { mimeType: effectiveMimeType || 'audio/mp3', data: audioData } },
      { text: instructions }
    ]
  } : { 
    parts: [{ text: `${instructions}\n\nInput: ${input}` }] 
  };

  const response = await ai.models.generateContent({
    model: modelName,
    contents,
    config: { 
      responseMimeType: "application/json", 
      responseSchema: analysisSchema,
      temperature: 0.1,
      tools: type === ContentType.URL ? [{ googleSearch: {} }] : undefined
    },
  });

  const result = JSON.parse(response.text || "{}");
  const safeReadingTime = Math.max(1, Math.round(result.reading_time) || 1);

  let discussionPoints = result.discussion_points || input;
  if (typeof discussionPoints !== 'string') {
    discussionPoints = JSON.stringify(discussionPoints);
  }

  // Extract token usage from the SDK response
  const usage = response.usageMetadata ? {
    inputTokens: response.usageMetadata.promptTokenCount,
    outputTokens: response.usageMetadata.candidatesTokenCount,
    totalTokens: response.usageMetadata.totalTokenCount,
    model: modelName,
    estimatedCost: modelName.includes('pro') 
      ? (response.usageMetadata.totalTokenCount / 1_000_000) * 1.25
      : (response.usageMetadata.totalTokenCount / 1_000_000) * 0.075
  } : undefined;

  return {
    title: result.title || "Untitled Recap",
    summary: result.summary || "",
    highlights: result.highlights || [],
    topics: result.topics || [],
    entities: result.entities || [],
    action_items: result.action_items || [],
    sentiment: (result.sentiment as Sentiment) || Sentiment.NEUTRAL,
    metadata: {
      readingTimeMinutes: safeReadingTime, 
      isDeepStrategist: (modelName === 'gemini-3-pro-preview'),
      momentumScore: result.momentum_score || 50,
      friction: result.friction || "None",
      usage
    },
    processed_text: discussionPoints
  };
};
