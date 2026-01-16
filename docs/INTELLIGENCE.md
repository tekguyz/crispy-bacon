# 🧠 Intelligence Strategy
**Engine:** Gemini 3 & 2.5 Series
**Philosophy:** Fact-Grounded Reasoning

## 1. Dynamic Routing
- **Standard Recaps:** `gemini-3-flash-preview` for rapid, cost-effective distillation.
- **Deep Distillation:** `gemini-3-pro-preview` for complex reasoning tasks (Executive Tier).
- **Realtime Assistant:** `gemini-2.5-flash-native-audio-preview-12-2025` for low-latency voice interrogation.

## 2. Context Engine
- **Strategic Trace:** The model maps generated highlights back to the original source to ensure accuracy.
- **Web Grounding:** When analyzing URLs, the system validates facts against live web data via Google Search.
- **Attachment Awareness:** Supports multi-modal context (Text Files, Drive Documents, Linked Insights).

## 3. Signal Healing
The system implements a robust **Signal Healing** protocol (`dataTransformers.ts`):
- **Stuck State Detection:** Identifies notes stuck in `reasoning` state that contain valid data.
- **Auto-Recovery:** Automatically transitions valid but "stuck" nodes to `completed` if the payload is healthy.

## 4. Structured Output
We enforce strictly typed JSON schemas for all generation tasks:
- **Executive Summary** (Markdown)
- **Key Takeaways** (String Array)
- **Action Items** (String Array)
- **Metadata** (Sentiment, Reading Time, Velocity Score)