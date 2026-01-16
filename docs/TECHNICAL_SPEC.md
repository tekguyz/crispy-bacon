# Crispy Bacon Technical Specification

## **Objective:** Implementation Blueprint

### **Architectural Constraints**
- **Framework:** React 19, TypeScript, Tailwind CSS.
- **Build System:** Vite.
- **Design System:** "Granola" (Tactile, High-Contrast, Serif/Mono mix).
- **Physics:** GPU-accelerated micro-animations.
- **State:** Hybrid (Zustand + TanStack Query).

---

## 1. State Orchestration

### Global Store (Zustand)
The application state is partitioned into specialized slices:
- **AuthSlice**: Supabase session and profile hydration.
- **IntelligenceSlice**: Orchestrates AI analysis lifecycle and Chat.
- **UISlice**: Global modals, themes, and toasts.

### Server State (TanStack Query)
- **Query Client**: Configured with stale-time strategies (5 minutes) to minimize network requests.
- **DataSynchronizer**: A headless component that watches Query data and updates the Zustand store.

### Realtime Sync
- Uses Supabase Postgres Changes to subscribe to database events (`INSERT`, `UPDATE`) and invalidate Query keys.

---

## 2. The Audio Pipeline

### Capture Engine
1. **Web Audio Initialization**: Captures raw PCM streams (16kHz for Voice, 24kHz for System).
2. **Worklet Processing**: Uses `AudioWorklet` (`pcm-processor`) for glitch-free processing on the main thread.
3. **Local Stashing**: Binary data is piped to **IndexedDB** immediately to prevent data loss on crash.
4. **Cloud Upload**: Files are uploaded to Supabase Storage before analysis triggers.

---

## 3. AI Interrogation Pattern

### RAG & Context
1. **Context Loading**: The system pulls the "Research Node" content (Original Content or Processed Transcript) into the system instruction.
2. **Global Chat**: Aggregates summaries from the top 20 recent insights to answer cross-node questions.
3. **Grounding**: The model is restricted to answering questions using only the source material provided.

---

## 4. Operational Systems

### Google Workspace Bridge
Read-only connections via Netlify Functions:
- `calendar`: Fetches event titles and times for the Dashboard agenda.
- `drive`: Lists supported file types (Docs, Audio) for the Import Studio.

### Billing Infrastructure (Stripe)
- **Upgrades**: Handled via secure `checkout.session`.
- **Provisioning**: Instant tier activation via Webhook (`stripe-webhook.ts`) listening for `checkout.session.completed`.

### Reliability Protocols
- **System Watchdog**: A client-side timer checks `isProcessing` state. If a signal remains "Thinking" for >45s without a heartbeat, the Watchdog releases the UI lock.
- **System Pulse**: The `SystemLogViewer` component captures the last 50 operational events for debugging.

---
**Maintained by Engineering Core**