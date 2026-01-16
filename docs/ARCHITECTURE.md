# 🏗️ System Architecture
**Topology:** Hybrid Local-Cloud (Stratified Ink)
**State Strategy:** Reactive Synchronization

## 1. The Data Pipeline
1.  **Capture:** Raw PCM audio (16kHz/24kHz) is captured via `AudioContext` or `AudioWorklet` (for Live).
2.  **Stash:** Binary blobs are immediately persisted to **IndexedDB** via `localDbService` to guarantee data safety before network transport.
3.  **Bridge:** Netlify Functions (`/functions/calendar`, `/functions/drive`) act as a secure gateway to external APIs.
4.  **Sync:** Audio artifacts are uploaded to Supabase Storage; metadata and vectors are stored in Postgres.

## 2. Reasoning Engine
The system utilizes a "Dual-Signal" routing logic based on user tier and task complexity.

| Tier | Capability | Engine |
| :--- | :--- | :--- |
| **Standard** | Rapid Recap | **Gemini 3 Flash** (Optimized for velocity) |
| **Executive** | Deep Strategist | **Gemini 3 Pro** (High-reasoning, complex context) |
| **Live** | Realtime Voice | **Gemini 2.5 Flash Native Audio** (Low latency, multimodal) |

## 3. Database Schema (Supabase)
### `insights` (The Research Node)
- `id`: Unique UUID.
- `processing_status`: State machine (`local` -> `uploading` -> `processing` -> `completed`).
- `metadata`: Stores `velocityScore`, `friction`, `contextAttachments`, and `isDeepStrategist` flags.

### `summaries` (The Distilled Layer)
- `summary`: The Markdown-formatted Executive Recap.
- `highlights`: Array of extracted key points.
- `action_items`: Array of detected next steps.

## 4. State Management
**Hybrid Architecture:**
- **Client State (Zustand):** Manages ephemeral UI state (Modals, Toasts, Audio Recording state, Live Session buffers).
- **Server State (TanStack Query):** Handles data fetching, caching, and invalidation for Insights, Collections, and Tags.
- **Synchronization:** The `<DataSynchronizer />` component observes Query cache updates and injects fresh data into the Zustand store, ensuring the UI is always reactive to both local and server changes.
- **Realtime:** Supabase `postgres_changes` events trigger Query invalidation, forcing a fresh fetch.