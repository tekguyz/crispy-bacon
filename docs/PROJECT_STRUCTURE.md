# 🥓 Crispy Bacon - Project Structure
**Status:** Canonical :: Humanist Standard

## 📂 Root Directory

| File | Description |
| :--- | :--- |
| `ErrorBoundary.tsx` | Global error catching and fallback UI. |
| `App.tsx` | Main application component and routing logic. |
| `index.tsx` | Application entry point and React root mounting. |
| `index.html` | HTML entry point with meta tags and font imports. |
| `index.css` | Global styles, Tailwind directives, and custom animations. |
| `types.ts` | Shared TypeScript interfaces and enums. |
| `vite.config.ts` | Vite build configuration and alias setup. |
| `tsconfig.json` | TypeScript compiler options. |
| `package.json` | Project dependencies and scripts. |
| `netlify.toml` | Netlify deployment configuration and redirects. |
| `manifest.json` | PWA manifest for installability. |
| `metadata.json` | App metadata and permission requests. |
| `README.md` | Project documentation and setup guide. |

---

## 📂 /components

### /features
#### /auth
- `AuthPortal.tsx`: Combined Sign In / Sign Up form.
- **/landing**: Landing page components (`Hero`, `Features`, `Pricing`, `Nav`, `Footer`).

#### /dashboard
- `CalendarSync.tsx`: Google Calendar integration widget.
- `DashboardHistory.tsx`: Chronological feed of recent notes.
- `DashboardTasks.tsx`: Extracted action items view.
- `GlobalChatSheet.tsx`: Global "Ask your notes" side drawer.

#### /feed
- `ActiveFiltersBar.tsx`: Display for active search/filter tags.
- `SelectionActionBar.tsx`: Floating bulk action bar (Delete, Archive, Pin).

#### /import (Formerly /ingest)
- `ImportBody.tsx`: Main content area for the Import modal.
- `ImportFooter.tsx`: Action buttons for import.
- `ImportHeader.tsx`: Title bar for import modal.
- `DriveSelector.tsx`: Google Drive file picker.

#### /InsightDetail
*Components specific to the Note Detail view.*
- `DetailHeader.tsx`: Navigation bar for the detail view.
- `InsightContentBody.tsx`: Main layout wrapper.
- `SummarySection.tsx`: The AI-generated executive summary.
- `SummaryStats.tsx`: Metadata ribbon (Reading time, Clarity score).
- `TakeawayGrid.tsx`: Key highlights list.
- `TaskList.tsx` & `TaskItem.tsx`: Interactive action item checklist.
- `ChatDrawer.tsx` & `ChatMessageBubble.tsx`: Q&A interface for the specific note.
- `InfoDrawer.tsx`: Metadata and settings sidebar.
- `AudioSource.tsx`: Audio player component.
- `ContextGrounding.tsx`: Source links and attachments.
- `ExportActions.tsx`: Copy to Notion/Obsidian buttons.
- `FolderSelection.tsx`: Collection management.
- `TaxonomySection.tsx`: Tags and entities.
- `QuickActions.tsx`: Pin/Archive/Share buttons.
- `StatusViews.tsx`: Loading and Error states.
- `LockedView.tsx`: Gate for non-pro historical items.
- `SkeletonDetail.tsx`: Loading shimmer state.

#### /legal
- `TermsPage.tsx`, `PrivacyPage.tsx`, `EthicsPage.tsx`: Static legal documents.

#### /settings
- `SettingsScreen.tsx`: Main settings layout.
- `IdentitySection.tsx`: User profile card.
- `IntegrationsSection.tsx`: Google Workspace connection.
- `InterfaceSection.tsx`: Theme and UI toggles.
- `SmartConfigSection.tsx`: AI model and voice preferences.
- `DataManagementSection.tsx`: Storage usage and export defaults.
- `ActivityLog.tsx`: Internal activity log (Formerly SystemLogViewer).

#### /studio
*The Recording Interface.*
- `RecorderHeader.tsx`: Status bar.
- `MethodSelector.tsx`: Choose between Voice Memo or Meeting Recap.
- `PreFlightCheck.tsx`: Audio permission confirmation.
- `AudioLevels.tsx`: Real-time visualizer.
- `MainEditor.tsx`: Live transcript/notes area.
- `StudioControls.tsx`: Template and depth toggles.
- `ReferenceFiles.tsx`: Reference material uploader (Formerly ContextDeck).
- `ActionFooter.tsx`: Record controls (Pause/Stop/Finish).
- `DepthToggle.tsx` & `GoalSelector.tsx`: Analysis configuration.

#### Feature Roots
- `Recorder.tsx`: Main recording modal controller (Formerly CaptureLab).
- `Dashboard.tsx`: Main overview page.
- `EmptyState.tsx`: Reusable empty state display.
- `QuickActionsMenu.tsx`: FAB (Floating Action Button) menu.
- `HelpScreen.tsx`: User manual.
- `InputArea.tsx`: Main import modal controller.
- `InsightCard.tsx`: Grid view card component.
- `InsightRow.tsx`: List view row component.
- `InsightDetailView.tsx`: Note detail view controller.
- `LiveAssistantSession.tsx`: Visualizer for the Gemini Live voice mode.
- `LoginScreen.tsx`: Authentication wrapper.
- `PublicShareView.tsx`: Read-only view for shared links.
- `SkeletonCard.tsx`: Loading state for cards.

### /layout
- `Header.tsx`: Top navigation bar.
- `Sidebar.tsx`: Left navigation rail.
- `UserAccountPopover.tsx`: User menu popup.
- `ViewRouter.tsx`: Main content area switcher.
- **/sidebar**: `PrimaryNavList.tsx`, `CollectionVault.tsx`, `UpgradeCard.tsx`.

### /modals
- `GlobalModalManager.tsx`: Root component for rendering active modals.
- `CollectionManagementModal.tsx`, `TagManagementModal.tsx`: Organization editors.
- `ShareModal.tsx`: Public link generator.
- `UpgradeModal.tsx`: Stripe payment flow.
- `ConfirmationModal.tsx`: Generic "Are you sure?" dialog.
- `OnboardingModal.tsx`: Welcome tour.

### /ui
- `Tooltip.tsx`, `Toast.tsx`: Notification and helper UI.
- `SideSheet.tsx`: Sliding drawer container.
- `ExpansionPanel.tsx`: Accordion component.
- `Loaders.tsx`: Custom loading spinners.
- `Logo.tsx`: SVG assets for Brand and Icons.
- `MarkdownRenderer.tsx`: React Markdown wrapper.
- `RemovableFilterChip.tsx`: Search filter pills.
- `SummaryOverlay.tsx`: Full-screen processing state.

---

## 📂 /store (Client UI State)
*Note: Server data is handled by React Query. Zustand is STRICTLY for ephemeral UI state.*
- `useAppStore.ts`: Main Zustand store entry point.
- `types.ts`: Store-specific type definitions.
- **Slices**:
  - `authSlice.ts`: Authentication state.
  - `uiSlice.ts`: Theme, sidebar, view state.
  - `assistantSlice.ts`: AI configuration state.
  - `liveSessionSlice.ts`: Voice mode state.
  - `voicePersonaSlice.ts`: TTS settings.

---

## 📂 /services
- `supabaseClient.ts`: Database connection instance.
- `geminiService.ts`: Core AI prompt engineering and API calls.
- `localDbService.ts`: IndexedDB wrapper for offline storage.
- `audioService.ts`: Web Audio API capture logic.
- `audioProcessing.ts`: Binary encoding/decoding utilities.
- `liveEngine.ts`: WebSocket handler for Gemini Live.
- `processingService.ts`: Orchestrates AI result archival.
- `repository.ts`: Data abstraction layer (Local vs Cloud merging).
- `googleBridge.ts`: Client-side interface for Netlify functions.
- `importService.ts`: File parsing logic (Mammoth/Text).
- `analyticsService.ts`: Usage tracking.
- `hapticService.ts`: Vibration API wrapper.
- `dataTransformers.ts`: Data mapping utilities.

---

## 📂 /hooks
- `useSessionOrchestrator.ts`: Manages auth state and background sync.
- `useQueries.ts`: React Query hooks for data fetching.
- `useMicrophone.ts`: Audio recording hook.
- `useLiveSession.ts`: Voice assistant hook.
- `useImport.ts`: File upload logic.
- `useDashboardStats.ts`: Analytics calculation.
- `useFilteredInsights.ts`: Search and filter logic.
- `useInsightDetailLogic.ts`: Real-time updates for open notes.
- `usePublicInsightLogic.ts`: Shared link logic.
- `useFileDrop.ts`: Drag-and-drop handler.
- `useFocusTrap.ts`: Accessibility helper.
- `usePageTitle.ts`: Dynamic document title.
- `useTheme.ts`: Dark mode handler.

---

## 📂 /netlify/functions
- `chat.ts`: Server-side chat proxy.
- `calendar.ts`: Google Calendar API proxy.
- `drive.ts`: Google Drive API proxy.
- `create-checkout-session.ts`: Stripe payment initiator.
- `stripe-webhook.ts`: Payment verification and tier upgrade.

---

## 📂 /docs
- `VISION.md`, `ARCHITECTURE.md`, `SECURITY.md`, `INTELLIGENCE.md`, `SETUP.md`: System documentation.

## 📂 /utils
- `dataUtils.ts`: Pure utility functions.

## 📂 /constants
- `navigation.ts`, `version.ts`: App constants.

## 📂 /lib
- `queryClient.ts`: TanStack Query configuration.