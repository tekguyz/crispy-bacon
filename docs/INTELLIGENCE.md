# 🧠 Intelligence Strategy
**Engine:** Gemini 3 & 2.5 Series

## 1. Dynamic Routing
- **Standard Recaps:** Uses `gemini-3-flash-preview` for rapid, cost-effective summarization.
- **Deep Distillation:** Pro users utilize `gemini-3-pro-preview` for complex reasoning and "Deep Strategist" persona analysis.
- **Realtime Assistant:** Uses `gemini-2.5-flash-native-audio-preview-12-2025` for low-latency, multimodal voice interaction.

## 2. Context Engine
- **Smart Memory:** For long contexts (>32k tokens), we utilize Gemini Context Caching to persist state across chat turns.
- **Web Grounding:** When analyzing URLs, the model uses Google Search tools to verify facts against live web data.
- **Attachment Awareness:** Supports multi-modal context injection (Text, Audio, Linked Insights).

## 3. Signal Healing
The system implements a robust **Signal Healing** protocol (`dataTransformers.ts`):
- **Stuck State Detection:** Identifies notes stuck in `processing` state that actually have data.
- **Auto-Recovery:** Automatically transitions valid but "stuck" nodes to `completed` if summaries or action items are present.

## 4. Structured Output
We enforce strictly typed JSON schemas for all generation tasks:
- **Executive Summary** (Markdown text)
- **Key Takeaways** (String Array)
- **Action Items** (String Array)
- **Metadata** (Sentiment, Reading Time, Friction Score)