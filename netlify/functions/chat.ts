
import { GoogleGenAI } from "@google/genai";

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message, transcript, rawContent, analysis, history, contextType, globalContext } = JSON.parse(event.body);
    
    if (!process.env.API_KEY) {
      throw new Error("Missing API configuration.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = 'gemini-3-flash-preview';

    let systemInstructionText = "";

    if (contextType === 'global') {
        systemInstructionText = `
          ROLE: Executive Research Librarian.
          CONTEXT: You have access to the summaries of the user's recent 20 research notes.
          
          LIBRARY DATA:
          """
          ${globalContext}
          """
          
          INSTRUCTIONS:
          - Answer questions based ONLY on the provided Library Data.
          - Synthesize connections across different notes if relevant.
          - If the information is not in the library, state it clearly.
          - Be concise and professional.
        `;
    } else {
        const primaryContext = rawContent && rawContent.length > 10 ? rawContent : transcript;
        systemInstructionText = `
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
    }

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
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Calculate usage
    const usage = response.usageMetadata ? {
      inputTokens: response.usageMetadata.promptTokenCount,
      outputTokens: response.usageMetadata.candidatesTokenCount,
      totalTokens: response.usageMetadata.totalTokenCount,
      model: modelName
    } : undefined;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        text: response.text || "I had trouble reading that.",
        sources: groundingChunks.map((chunk: any) => chunk.web).filter(Boolean),
        model: modelName,
        usage
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
