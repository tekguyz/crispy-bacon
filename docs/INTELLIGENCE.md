# 🧠 Intelligence Strategy
**Engine:** Gemini 3 & 2.5 Series
**Philosophy:** Fact-Grounded Reasoning

## 1. Dynamic Routing
- **Standard Recaps:** Uses `gemini-3-flash-preview` for rapid, cost-effective summarization of standard meetings and articles.
- **Deep Distillation:** Executive users utilize `gemini-3-pro-preview` for complex reasoning tasks, specifically when the "Deep Strategist" persona is active.
- **Realtime Assistant:** Uses `gemini-2.5-flash-native-audio-preview-12-2025` for low-latency, multimodal voice interaction during "Ask Voice" sessions.

## 2. Context Engine
- **Strategic Trace:** The system maps generated highlights back to the original transcript to ensure accuracy.
- **Web Grounding:** When analyzing URLs, the model uses Google Search tools to verify facts against live web data.
- **Attachment Awareness:** Supports multi-modal context injection (Text Files, Drive Documents, Linked Insights).

## 3. Signal Healing
The system implements a robust **Signal Healing** protocol (`dataTransformers.ts`):
- **Stuck State Detection:** Identifies notes stuck in `processing` state that actually contain valid summary data.
- **Auto-Recovery:** Automatically transitions valid but "stuck" nodes to `completed` if summaries or action items are detected in the payload.

## 4. Structured Output
We enforce strictly typed JSON schemas for all generation tasks to ensure the UI can render:
- **Executive Summary** (Markdown text)
- **Key Takeaways** (String Array)
- **Action Items** (String Array)
- **Metadata** (Sentiment, Reading Time, Momentum Score)