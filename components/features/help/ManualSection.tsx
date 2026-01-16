import React from 'react';
import { BookOpen, Mic, Globe, MessageSquare, Target, ShieldCheck, Zap } from 'lucide-react';
import { FeatureCard } from './HelpUI';
import MarkdownRenderer from '../../ui/MarkdownRenderer';

const MANUAL_CONTENT = `
# How it Works
### Clear summaries for better thinking

Crispy Bacon helps you recover important details from meetings, articles, and calls, turning them into clean, high-density notes.

---

## 1. Capturing Information
You can capture information in three simple ways:

*   **Record Meetings**: Bacon records your computer's audio directly. It hears Zoom, Teams, Meet, or browser audio. **No bots required.** We record the audio, not the participants.
*   **Summarize Links**: Paste a URL. We remove the ads and clutter to find the core research and facts.
*   **Import Files**: Connect your Google Drive to import recording archives or documents for rapid analysis.

---

## 2. Choosing a Focus
Direct the summary engine by choosing what matters most:
*   **Executive Brief**: Focuses on outcomes, constraints, and next steps.
*   **Product Discovery**: Calibrated to find user feedback and pain points.
*   **Technical Review**: Identifies blockers and architectural details.
*   **Stakeholder Sync**: Summarizes high-level progress for reporting.

---

## 3. Asking Questions
Notes are interactive. Talk to your notes to find specific details or clarify next steps:
*   **Direct Questions**: "Who specifically agreed to the budget?"
*   **Quick Lists**: "Give me just the blockers mentioned."
*   **Talk to Notes**: Talk directly to your notes to clarify details while you're on the go.

---

## 4. Privacy
Bacon is a private environment. Your library is encrypted and isolated. We never use your data to train public AI models.
`;

export const ManualSection: React.FC = () => (
  <div className="animate-fade-in pb-20 max-w-3xl mx-auto space-y-12">
     <div className="prose-manual pt-0">
        <MarkdownRenderer content={MANUAL_CONTENT} />
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-12 border-t border-on-surface/5">
        <FeatureCard 
          icon={Mic} 
          title="Direct Recording" 
          desc="Record any meeting without inviting intrusive bots. Pure audio capture." 
          badge="PRIVACY" 
        />
        <FeatureCard 
          icon={Target} 
          title="Fact Checking" 
          desc="The assistant only uses the facts provided. If a detail is missing, it won't guess." 
          badge="ACCURACY" 
        />
        <FeatureCard 
          icon={Zap} 
          title="Fast Recaps" 
          desc="Turn a 60-minute session into a 2-minute summary instantly." 
          badge="SPEED" 
        />
        <FeatureCard 
          icon={ShieldCheck} 
          title="Secure Vault" 
          desc="Industry-standard protection. Your research stays in your secure workspace." 
          badge="SECURITY" 
        />
     </div>
  </div>
);