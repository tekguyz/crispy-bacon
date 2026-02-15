
# 🧠 AI & Reasoning
**Engine:** Gemini 3 & 2.5 Series
**Philosophy:** Fact-Grounded Reasoning

## 1. Model Selection
- **Standard Recaps:** Uses a fast, efficient model for quick summaries.
- **Deep Analysis:** Uses a more powerful reasoning model for complex documents (Executive Tier).
- **Realtime Assistant:** Uses a specialized native-audio model for instant voice conversation.

## 2. Context Awareness
- **Fact Checking:** The system maps generated highlights back to the original source text to ensure accuracy.
- **Web Grounding:** When analyzing links, the system validates facts against live web data via Google Search.
- **Attachment Support:** The assistant can read multiple sources (Text Files, Drive Documents, Linked Notes) to build a complete picture.

## 3. Note Recovery
The system implements a robust **Auto-Recovery** method:
- **Health Check:** Automatically detects if a note gets stuck during analysis.
- **Repair:** If valid data exists, the system forces the note to complete, ensuring you don't lose your work due to a network hiccup.

## 4. Structured Output
We enforce strict formats for all AI generation to ensure consistency:
- **Executive Summary** (Markdown text)
- **Key Takeaways** (List)
- **Action Items** (Checklist)
- **Metadata** (Sentiment, Reading Time, Clarity Score)
