
import { GoogleGenAI } from "@google/genai";

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message, transcript, rawContent, analysis, history } = JSON.parse(event.body);
    
    if (!process.env.API_KEY) {
      throw new Error("Missing API configuration.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // RAG SYSTEM MODEL: Gemini 3 Flash (Fastest and Most Efficient)
    const modelName = 'gemini-3-flash-preview';

    const primaryContext = rawContent && rawContent.length > 10 ? rawContent : transcript;
    
    const systemInstructionText = `
      ROLE: Professional Research Partner.
      CONTEXT: ${analysis?.title || 'Untitled Research'}
      
      SOURCE MATERIAL:
      """
      ${primaryContext}
      """
      
      INSTRUCTIONS:
      - Use the 'SOURCE MATERIAL' to provide precise, evidence-based answers.
      - If the detail is not in the material, be honest.
      - Be direct and efficient.
    `;

    const turnHistory = (history || []).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    turnHistory.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: turnHistory,
      config: {
        systemInstruction: systemInstructionText,
        temperature: 0.2,
        // Removed googleSearch tool to prevent latency timeouts (504s) and ensure strict RAG adherence.
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        text: response.text || "I had trouble reading that.",
        sources: groundingChunks.map((chunk: any) => chunk.web).filter(Boolean),
        model: modelName
      }),
    };
  } catch (error: any) {
    console.error("[Chat API Failure]", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message || "Internal error." }) 
    };
  }
};