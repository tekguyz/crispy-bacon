
import { GoogleGenAI } from "@google/genai";

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message, transcript, rawContent, analysis, history, contextType, globalContext } = JSON.parse(event.body);
    
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Missing API configuration.");
    }

    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    const modelName = 'gemini-3.5-flash';

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
        // CONTEXT HYDRATION:
        // We inject the structured analysis (what the user sees in the UI) into the prompt.
        // This ensures consistency between the "Decision Checklist" on screen and the Chat's answers.
        
        const knownActions = (analysis?.action_items || []).map((i: string) => `- ${i}`).join('\n');
        const knownHighlights = (analysis?.highlights || []).map((i: string) => `- ${i}`).join('\n');
        const knownSummary = analysis?.summary || "No summary available.";
        
        const primaryContext = rawContent && rawContent.length > 10 ? rawContent : transcript;

        systemInstructionText = `
          ROLE: Professional Research Partner.
          CONTEXT: "${analysis?.title || 'Untitled Research'}"
          
          === KNOWN INTELLIGENCE (ALREADY EXTRACTED) ===
          The following points have already been identified in this document. Use them as the PRIMARY source of truth for lists, decisions, and summaries.
          
          SUMMARY:
          ${knownSummary}
          
          ESTABLISHED ACTION ITEMS & DECISIONS:
          ${knownActions.length > 0 ? knownActions : "None explicitly extracted yet."}
          
          KEY TAKEAWAYS:
          ${knownHighlights}
          
          === RAW SOURCE MATERIAL ===
          Use this to answer specific questions about details not covered in the extracted intelligence above.
          """
          ${primaryContext}
          """
          
          INSTRUCTIONS:
          - If asked for "Action Items", "Decisions", or "Takeaways", REITERATE the 'ESTABLISHED ACTION ITEMS' listed above first.
          - Then, check the RAW SOURCE MATERIAL for any additional details.
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
