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
Partitioned into specialized slices:
- **AuthSlice**: Supabase session and profile hydration.
- **IntelligenceSlice**: Orchestrates Reasoning lifecycle and Chat.
- **UISlice**: Global modals, themes, and toasts.

### Server State (TanStack Query)
- **Query Client**: Configured with stale-time strategies (5 minutes).
- **DataSynchronizer**: A headless component that bridges Query cache updates to the Zustand store.

---

## 2. The Audio Pipeline

### Capture Engine
1. **Web Audio Initialization**: Captures raw PCM streams (16kHz Voice, 24kHz System).
2. **Worklet Processing**: Uses `AudioWorklet` (`pcm-processor`) for glitch-free processing.
3. **Local Stashing**: Binary data is piped to **IndexedDB** immediately.
4. **Vault Upload**: Files are uploaded to Supabase Storage before analysis.

---

## 3. AI Interrogation Pattern

### RAG & Context
1. **Context Loading**: The system pulls the "Research Node" content into the system instruction.
2. **Global Chat**: Aggregates summaries from recent insights for cross-node reasoning.
3. **Grounding**: The model is restricted to answering using *only* source material.

---

## 4. Operational Systems

### Google Workspace Bridge
Read-only connections via Netlify Functions:
- `calendar`: Fetches agenda for context.
- `drive`: Lists supported file types for import.

### Billing Infrastructure (Stripe)
- **Upgrades**: Handled via secure `checkout.session`.
- **Provisioning**: Instant tier activation via Webhook.

### Reliability Protocols
- **System Watchdog**: Releases UI locks if reasoning hangs >45s.
- **System Pulse**: Captures operational logs for debugging.

---
**Maintained by Engineering Core**