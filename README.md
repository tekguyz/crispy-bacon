# 🥓 Crispy Bacon

**High-Density Research Library for High-Performance Teams.**

Crispy Bacon is a "Time-to-Think" engine. It transforms raw information—meetings, documents, and links—into high-clarity strategic notes. It is designed with a specific philosophy: **Signal > Noise**.

## 🌟 Core Philosophy

*   **Warmth:** Interfaces feel like a premium notebook (Sandstone & Charcoal), not a command terminal.
*   **Density:** No AI fluff. We prefer objective bullet points and structured decisions over long paragraphs.
*   **Privacy:** "My Data" policy. No bots in meetings. Local-first recording.

## 🚀 Key Features

*   **Capture Lab:** High-fidelity audio recording with real-time visualization.
*   **Import:** Ingest web links, text notes, and Google Drive files.
*   **The Assistant:**
    *   **Standard Tier:** Rapid skeletal recaps using **Gemini 3 Flash**.
    *   **Executive Tier:** Deep narrative analysis using **Gemini 3 Pro**.
    *   **Live Mode:** Real-time voice conversation using **Gemini 2.5 Flash Native Audio**.
*   **Knowledge Graph:** Auto-tagging, entity extraction, and cross-note linking.
*   **Dashboard:** A "feed" of your strategic life, filterable by time, source, and sentiment.

## 🛠️ Tech Stack

*   **Frontend:** React 18, Vite, TypeScript
*   **Styling:** Tailwind CSS (Custom "Organic" Theme)
*   **State Management:** Zustand (Client), TanStack Query (Server)
*   **Backend / Database:** Supabase (PostgreSQL, Auth, Storage)
*   **AI / Intelligence:** Google Gemini API (via `@google/genai` SDK)
*   **Serverless:** Netlify Functions

## 📚 Documentation

Detailed documentation is located in the `/docs` directory:

*   [**VISION.md**](/docs/VISION.md): The design philosophy and "No-Bot" standard.
*   [**ARCHITECTURE.md**](/docs/ARCHITECTURE.md): System design, data flow, and database schema.
*   [**PROJECT_STRUCTURE.md**](/docs/PROJECT_STRUCTURE.md): File map and code organization.
*   [**INTELLIGENCE.md**](/docs/INTELLIGENCE.md): AI model selection and reasoning logic.
*   [**SECURITY.md**](/docs/SECURITY.md): Privacy standards and data isolation.
*   [**SETUP.md**](/docs/SETUP.md): Environment variables and deployment guide.

## ⚡️ Quick Start

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configure Environment:**
    Copy `.env.example` to `.env` and fill in your keys (see [SETUP.md](/docs/SETUP.md)).

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

4.  **Build for Production:**
    ```bash
    npm run build
    ```

## 🔐 License

Proprietary & Confidential.
*Maintained by Engineering Core :: Crispy Bacon Research*
