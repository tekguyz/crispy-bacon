
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
  
  // Logic: Pro users can choose "Deep Research". Everyone else (including Pro choosing "Concise") gets Flash.
  const isDeep = isPro && persona === PersonaStyle.DEEP_RESEARCH;
  const modelName = isDeep ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  let instructions = "";

  if (isDeep) {
    instructions = `
      ROLE: Principal Briefing Deck Architect.
      TASK: Conduct a COMPREHENSIVE NARRATIVE ANALYSIS. 
      USER_GOAL: ${userNotes || 'Detailed Strategic Analysis'}.
      FOCUS: ${template}.
      
      OUTPUT PROTOCOL - DEEP DISTILL (PRO):
      1. NARRATIVE DEPTH: The 'summary' must be EXTENSIVE (max 300 words). Explore "Why" and "How", nuances, friction points, and strategic implications. Use Markdown headers (###) for sections.
      2. HIGHLIGHTS: Provide EXACTLY 5 to 10 granular facts/takeaways. (NEVER more than 10).
      3. ACTION ITEMS: Provide a granular, step-by-step execution plan.
      4. TAXONOMY: Provide EXACTLY 5 project-specific topics.
      5. FORMATTING: Always use double newlines (\\n\\n) after every ### header.
    `;
  } else {
    instructions = `
      ROLE: Senior Executive Assistant.
      TASK: Create a RAPID SKELETAL RECAP.
      USER_GOAL: ${userNotes || 'Standard Strategic Recap'}.
      FOCUS: ${template}.
      
      OUTPUT PROTOCOL - RAPID MODE (STANDARD):
      1. SUMMARY: Skeletal overview. Max 150 words. Focus strictly on outcomes.
      2. HIGHLIGHTS: Top 3-5 critical points only.
      3. ACTION ITEMS: Basic checklist of immediate needs.
      4. TAXONOMY: Provide EXACTLY 3 topics.
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
    topics: (result.topics || []).slice(0, isDeep ? 5 : 3),
    entities: result.entities || [],
    action_items: result.action_items || [],
    sentiment: (result.sentiment as Sentiment) || Sentiment.NEUTRAL,
    metadata: {
      readingTimeMinutes: safeReadingTime, 
      isDeepStrategist: isDeep,
      momentumScore: result.momentum_score || 50,
      friction: result.friction || "None",
      usage,
      velocityScore: result.momentum_score || 50
    },
    processed_text: discussionPoints
  };
};
