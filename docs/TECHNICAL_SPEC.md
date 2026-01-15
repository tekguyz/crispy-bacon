# Crispy Bacon Technical Specification

## **Objective:** Implementation Blueprint

### **Architectural Constraints**
- **Framework:** React 19, TypeScript, Tailwind CSS.
- **Design:** Material 3 influence, high-contrast "Granola" palette.
- **Physics:** GPU-accelerated micro-animations (`translate3d`, `opacity`).
- **State:** Hybrid (Zustand + TanStack Query).

---

## 1. State Orchestration

### Global Store (Zustand)
The application state is partitioned into specialized slices:
- **AuthSlice**: Supabase session and profile hydration.
- **IntelligenceSlice**: Orchestrates AI analysis lifecycle and Chat.
- **UISlice**: Global modals, themes, and toasts.

### Server State (TanStack Query)
- **Query Client**: Configured with stale-time strategies to minimize network requests.
- **DataSynchronizer**: A headless component that watches Query data and updates the Zustand store, ensuring the UI is always reactive to both local and server changes.

### Realtime Sync
- Uses Supabase Postgres Changes to subscribe to database events (`INSERT`, `UPDATE`) and invalidate Query keys, forcing fresh data fetches.

---

## 2. The Audio Pipeline

### Capture Engine
1. **Web Audio initialization**: Captures raw PCM streams (16kHz/24kHz).
2. **Worklet Processing**: Uses `AudioWorklet` for glitch-free audio processing on the main thread.
3. **Local Stashing**: Binary data is piped to **IndexedDB** immediately.
4. **Cloud Upload**: Files are uploaded to Supabase Storage before analysis triggers.

---

## 3. AI Interrogation Pattern

### RAG & Caching
1. **Context Loading**: The system pulls the "Research Node" content into the system instruction.
2. **Caching**: If context > 32k tokens, `ai.caches.create` is used to lower latency for subsequent chat turns.
3. **Grounding**: The model is restricted to answering questions using only the source material provided.

---

## 4. View Architecture

### Responsive Routing
- **Dashboard**: High-level triage and upcoming meeting sync.
- **History Feed**: Chronological list of nodes with virtualized or grid layouts.
- **Detail View**: Split-pane layout (Desktop) / Sheet (Mobile). Includes "Strategic Trace" and "Live Assistant".

---

## 5. Operational Systems

### Google Workspace Bridge
We maintain three specific read-only connections via Netlify Functions:
- `calendar`: Fetches event titles and times for the Dashboard agenda.
- `drive`: Lists supported file types (Docs, Audio) for the Import Studio.
- `tasks`: Used internally to heuristic match meetings to to-do items.

### Billing Infrastructure (Stripe)
- **Upgrades:** Handled via secure `checkout.session`.
- **Provisioning:** Instant tier activation via Webhook (`stripe-webhook.ts`) listening for `checkout.session.completed`.
- **Resilience:** The webhook performs an atomic update to the `profiles` table using the `SUPABASE_SERVICE_ROLE_KEY`.

### Reliability Protocols
- **System Watchdog:** A client-side timer checks `isProcessing` state. If a signal remains "Thinking" for >45s without a heartbeat, the Watchdog releases the UI lock.
- **System Pulse:** The `SystemLogViewer` component captures the last 50 operational events in memory for rapid debugging of connection issues.

---
**Maintained by Engineering Core**