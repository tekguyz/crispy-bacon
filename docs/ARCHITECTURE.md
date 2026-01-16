# 🏗️ System Architecture
**Topology:** Hybrid Local-Cloud (Stratified Ink)
**State Strategy:** Reactive Synchronization

## 1. The Data Pipeline
1.  **Capture:** Raw PCM audio (16kHz/24kHz) is captured via `AudioContext` loopback or `AudioWorklet`.
2.  **Stash:** Binary blobs are immediately persisted to **IndexedDB** via `localDbService` to guarantee data safety before network transport.
3.  **Bridge:** Netlify Functions (`/functions/calendar`, `/functions/drive`) act as a secure gateway.
4.  **Vault:** Artifacts are encrypted and uploaded to Supabase Storage; metadata is indexed in Postgres.

## 2. Reasoning Engine
The system utilizes a "Dual-Signal" routing logic based on user tier and task complexity.

| Tier | Capability | Engine |
| :--- | :--- | :--- |
| **Standard** | Rapid Recap | **Gemini 3 Flash** (Velocity Optimized) |
| **Executive** | Deep Strategist | **Gemini 3 Pro** (High-Reasoning / 2M Context) |
| **Live** | Ask Voice | **Gemini 2.5 Flash Native Audio** (Low Latency) |

## 3. Database Schema (Supabase)
### `insights` (The Research Node)
- `id`: Unique UUID.
- `processing_status`: State machine (`local` -> `uploading` -> `reasoning` -> `completed`).
- `metadata`: Stores `velocityScore`, `friction`, `contextAttachments`, and `isDeepStrategist`.

### `summaries` (The Distilled Layer)
- `summary`: Markdown-formatted Executive Recap.
- `highlights`: Array of extracted facts.
- `action_items`: Array of detected next steps.

## 4. State Management
**Hybrid Architecture:**
- **Client State (Zustand):** Manages ephemeral UI state (Modals, Toasts, Recorder, Live Buffers).
- **Server State (TanStack Query):** Handles hydration, caching, and invalidation for Insights and Collections.
- **Synchronization:** The `<DataSynchronizer />` component injects Query data into the Zustand store, ensuring reactive UI updates.