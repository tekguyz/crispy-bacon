
# 🥓 Crispy Bacon

**A quiet place to think.**

Crispy Bacon is a professional research assistant designed for high-performance leaders. It captures audio or text and transforms it into clear, organized notes using advanced AI. 

We prioritize **signal over noise**, **privacy over data mining**, and **direct recording over meeting bots**.

---

## The Philosophy

We believe professionals are drowning in noise. This tool allows you to:
1.  **Capture Naturally:** Record thoughts or meetings directly from your device. No bots, no avatars, no intrusion.
2.  **Think Clearly:** Our AI removes the fluff and extracts the decisions, facts, and action items that actually matter.
3.  **Own Your Data:** Your notes are yours. They are encrypted, isolated, and never used to train public models.

## Key Capabilities

*   **Invisible Recording:** Captures system audio or microphone input directly. Works with Zoom, Teams, Meet, or in-person sessions.
*   **Executive Summaries:** Turns 60 minutes of conversation into a 2-minute strategic read.
*   **Deep Reasoning:** Uses Google's Gemini 3 Pro to understand context, nuance, and implied tasks.
*   **Voice Assistant:** Talk to your library. Ask questions about previous notes while walking or driving.
*   **Local-First Speed:** Recordings save to your device instantly, ensuring no data is lost even if the internet drops.

## Getting Started

### 1. Prerequisites
*   Node.js (v18+)
*   A Supabase Project
*   A Google Cloud Project (for Gemini API)
*   Stripe Account (Optional, for Pro features)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/your-org/crispy-bacon.git

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Frontend Keys
VITE_SUPABASE_DATABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_VERSION=2.5.1

# Backend Keys (Netlify / Serverless)
API_KEY=your_gemini_api_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Running the App

```bash
# Start local development server
npm run dev
```

## Architecture

*   **Frontend:** React 19, TypeScript, Tailwind CSS (Sandstone & Charcoal palette).
*   **State Management:** Zustand (Client) + TanStack Query (Server State).
*   **Database:** Supabase (PostgreSQL + Realtime).
*   **Intelligence:** Google Gemini 3 Flash (Fast Recap) & Gemini 3 Pro (Deep Analysis).
*   **Audio:** Web Audio API with local IndexedDB fallback for reliability.

## Documentation

For detailed information on the system's design and standards, refer to the `docs/` folder:

*   **[VISION.md](docs/VISION.md):** Design principles and philosophy.
*   **[SECURITY.md](docs/SECURITY.md):** Data privacy and encryption standards.
*   **[INTELLIGENCE.md](docs/INTELLIGENCE.md):** How the AI reasoning engine works.

---

*Designed for clarity.*
