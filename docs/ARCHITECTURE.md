# 🏗️ System Architecture
**Topology:** Hybrid Local-Cloud (Stratified Ink)

## 1. The Data Pipeline
1.  **Capture:** We grab raw audio (PCM) from your mic or system via `AudioContext`.
2.  **Stash:** Data is instantly saved to **Local Memory** (IndexedDB) via `localDbService` to prevent loss.
3.  **Bridge:** Netlify Functions act as a secure gatekeeper.
4.  **Sync:** Audio goes to Supabase Storage; text metadata goes to Postgres.

## 2. Reasoning Engine
The system uses a "Dual-Signal" logic based on task complexity.

| Tier | Capability | Engine |
| :--- | :--- | :--- |
| **Standard** | Quick Recap | **Gemini 3 Flash** (High speed) |
| **Executive** | Deep Strategy | **Gemini 3 Pro** (High reasoning) |
| **Live** | Q&A | **Gemini 2.5 Flash Native Audio** (Low latency) |

## 3. Database Schema (Supabase)
### `insights` (The Research Node)
- `id`: Unique UUID.
- `title`: The name of your note.
- `processing_status`: State machine (`local` -> `uploading` -> `processing` -> `completed`).
- `metadata`: Scores, friction points, context attachments.

### `summaries` (The Distilled Layer)
- `summary`: The Executive Recap.
- `highlights`: Key takeaways array.
- `action_items`: Checklist array.

## 4. State Management
**Hybrid Architecture:**
- **Client State (Zustand):** Manages UI session, modal visibility, and ephemeral inputs.
- **Server State (TanStack Query):** Handles data fetching, caching, and invalidation for Insights, Collections, and Tags.
- **Synchronization:** The `DataSynchronizer` component bridges server state into the Zustand store for reactive UI updates.
- **Persistence:** Local artifacts are persisted via IndexedDB before cloud sync.