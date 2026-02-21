# 🏗️ System Architecture
**Structure:** Local-First, Cloud-Secure
**Strategy:** Decoupled State (No Synchronizers)

## 1. The Data Flow
1.  **Recording:** Raw audio is captured directly from your device (Microphone or System Audio) using a high-fidelity processor.
2.  **Local Save:** Data is immediately saved to your device's internal database (IndexedDB) to guarantee safety before any network transfer.
3.  **Gateway:** Secure serverless functions handle communication with external services like Google and Stripe.
4.  **Cloud Storage:** Files are encrypted and uploaded to a private storage vault; note details are indexed in a secure database.

## 2. Intelligence Engine
The system uses a "Smart Selection" logic to choose the right model for the user's tier and task.

| Tier | Capability | Engine |
| :--- | :--- | :--- |
| **Standard** | Rapid Recap | **Gemini 3 Flash** (Speed Optimized) |
| **Executive** | Deep Analysis | **Gemini 3 Pro** (High-Reasoning / Large Context) |
| **Live** | Ask Voice | **Gemini 2.5 Flash Native Audio** (Low Latency) |

## 3. Database Structure
### `insights` (The Note)
- `id`: Unique Identifier.
- `processing_status`: Tracks progress (`local` -> `uploading` -> `analyzing` -> `completed`).
- `metadata`: Stores scores, attachment links, and analysis depth settings.
- `processed_text`: The raw text or transcript used for analysis.

### `summaries` (The Content)
- `summary`: The Executive Recap text (Markdown).
- `highlights`: List of extracted facts.
- `action_items`: List of detected next steps.
- `topics`: Categorical tags.
- `sentiment`: POSITIVE, NEUTRAL, NEGATIVE, or COMPLEX.

## 4. App State & Logic (Decoupled)
We maintain a strict boundary between "Server State" and "Client UI State" to prevent redundant rendering. **We do not use synchronizer components.**
- **Server State (TanStack Query):** Owns all asynchronous data. It connects directly to Supabase to fetch, cache, and mutate data. UI components subscribe directly to these hooks.
- **Client UI State (Zustand):** Owns ephemeral interface data (e.g., active filters, open modals). It does *not* cache database payloads.

## 5. Audio Implementation
- **Web Audio:** We use standard web technologies to capture high-quality audio streams.
- **Processor:** A dedicated background worker (`AudioWorklet`) ensures audio is processed smoothly without freezing the interface.
- **Safety:** Binary audio data is saved to the local device immediately, preventing data loss if the internet connection drops.