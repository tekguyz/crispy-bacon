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
  
  // LOGIC: Differentiate between "Standard Recap" (Free) and "Deep Distill" (Pro)
  // Deep Research forces the Pro model and requests significantly higher density output.
  const isDeep = isPro && persona === PersonaStyle.DEEP_RESEARCH;
  const modelName = isDeep ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  let instructions = "";

  if (isDeep) {
    // DEEP DISTILL (PRO): High volume, high detail, narrative depth.
    instructions = `
      ROLE: Principal Strategy Consultant.
      TASK: Conduct a COMPREHENSIVE DEEP-DIVE analysis of the raw capture.
      USER_GOAL: ${userNotes || 'Detailed Strategic Analysis'}.
      FOCUS: ${template}.
      
      STANDARDS - DEEP RESEARCH MODE (PRO):
      1. SUMMARY: Must be EXTENSIVE, NARRATIVE, and DETAILED. Do not summarize briefly. Explore nuances, underlying friction, and strategic implications. Explain the "Why" and "How" behind the content. (Target: 600+ words if source allows).
      2. HIGHLIGHTS: Extract an exhaustive list of facts, figures, decisions, and quotes. Capture specific details, not just generalities.
      3. ACTION ITEMS: Provide a granular, step-by-step execution plan.
      4. STYLE: Rigorous, analytical, exhaustive.
    `;
  } else {
    // STANDARD RECAP (FREE): Fast, skeletal, punchy.
    instructions = `
      ROLE: Senior Executive Assistant.
      TASK: Create a RAPID CONCISE RECAP.
      USER_GOAL: ${userNotes || 'Standard Strategic Recap'}.
      FOCUS: ${template}.
      
      STANDARDS - RAPID MODE (STANDARD):
      1. SUMMARY: SKELETAL and CONCISE. High-level overview only. (Target: < 200 words).
      2. HIGHLIGHTS: Top 3-5 critical points only.
      3. ACTION ITEMS: High-level checklist.
      4. STYLE: Brevity, direct assertion, zero fluff. Ban conversational lubricant.
    `;
  }

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

  // Extract token usage safely from the SDK response
  const usageMetadata = response.usageMetadata;
  const usage = usageMetadata ? {
    inputTokens: usageMetadata.promptTokenCount || 0,
    outputTokens: usageMetadata.candidatesTokenCount || 0,
    totalTokens: usageMetadata.totalTokenCount || 0,
    model: modelName,
    estimatedCost: usageMetadata.totalTokenCount 
      ? (modelName.includes('pro') 
          ? (usageMetadata.totalTokenCount / 1_000_000) * 1.25
          : (usageMetadata.totalTokenCount / 1_000_000) * 0.075)
      : 0
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
      isDeepStrategist: isDeep,
      momentumScore: result.momentum_score || 50,
      friction: result.friction || "None",
      usage
    },
    processed_text: discussionPoints
  };
};