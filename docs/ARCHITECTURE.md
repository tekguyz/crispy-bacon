
# 🏗️ System Architecture
**Structure:** Local-First, Cloud-Secure
**Strategy:** Reactive Synchronization

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

### `summaries` (The Content)
- `summary`: The Executive Recap text.
- `highlights`: List of extracted facts.
- `action_items`: List of detected next steps.

## 4. App State & Logic
**Hybrid Approach:**
- **Client State (Zustand):** Manages immediate UI interactions (Modals, Alerts, Recorder status).
- **Server State (TanStack Query):** Handles data loading, caching, and keeping notes in sync with the cloud.
- **Synchronization:** A specialized background component connects the local UI with the cloud data, ensuring the screen always shows the latest information.

## 5. Audio Implementation
- **Web Audio:** We use standard web technologies to capture high-quality audio streams.
- **Processor:** A dedicated background worker (`AudioWorklet`) ensures audio is processed smoothly without freezing the interface.
- **Safety:** Binary audio data is saved to the local device immediately, preventing data loss if the internet connection drops.
