
import React from 'react';
import { BookOpen, Mic, Globe, MessageSquare, Target, ShieldCheck, Zap } from 'lucide-react';
import { FeatureCard } from './HelpUI';
import MarkdownRenderer from '../../ui/MarkdownRenderer';

const MANUAL_CONTENT = `
# The Instrument
### Professional Distillation for High-Output Thinking

Crispy Bacon is a mechanical instrument for signal recovery. It recaptures lost context from meetings, articles, and calls, distilling them into high-density recaps.

---

## 1. Input: Capturing Signal
Everything starts with an "Input." Capture happens in three distinct flows:

*   **System Audio Recaps**: On Desktop, Bacon listens to your computer's audio loop directly. It hears Zoom, Teams, Meet, or browser audio. **No bots are required.** We capture the signal, not the attendees.
*   **Web Distillation**: Paste a URL. We strip the noise, ads, and filler to recover the core research data.
*   **Vault Import**: Direct cloud-to-cloud retrieval from Google Drive. Import audio archives or text dossiers for rapid reasoning.

---

## 2. Reasoning: The Framework
Direct the reasoning engine by selecting a strategic objective:
*   **Executive Brief**: Prioritizes outcomes, hard constraints, and next steps.
*   **Product Discovery**: Calibrated to detect pain points and user friction.
*   **Technical Review**: Identifies engineering blockers and architectural debt.
*   **Stakeholder Sync**: Summarizes high-level progress for reporting.

---

## 3. Interrogation: Ask Voice
Notes are not static. Use **Ask Voice** or the **Assistant Chat** to interrogate your research:
*   **Direct Inquiry**: "Who specifically agreed to the budget?"
*   **Summarization**: "Give me just the blockers mentioned."
*   **Multimodal**: Talk directly to your notes to clarify details verbally while you drive or walk.

---

## 4. Privacy as Bedrock
Bacon is a private environment. Your library is encrypted and isolated. We never train general models on your private nodes.
`;

export const ManualSection: React.FC = () => (
  <div className="animate-fade-in pb-20 max-w-3xl mx-auto space-y-12">
     <div className="prose-manual pt-0">
        <MarkdownRenderer content={MANUAL_CONTENT} />
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-12 border-t border-on-surface/5">
        <FeatureCard 
          icon={Mic} 
          title="Direct Loopback" 
          desc="Capture any meeting audio without inviting intrusive bots. Pure signal capture." 
          badge="HARDWARE" 
        />
        <FeatureCard 
          icon={Target} 
          title="Fact Grounding" 
          desc="The assistant is prohibited from guessing. If a detail is missing, it reports 'Unresolved'." 
          badge="REASONING" 
        />
        <FeatureCard 
          icon={Zap} 
          title="Rapid Recap" 
          desc="Turn a 60-minute session into a 2-minute strategic brief instantly." 
          badge="VELOCITY" 
        />
        <FeatureCard 
          icon={ShieldCheck} 
          title="Cloud Vault" 
          desc="Industry-standard isolation. Your research never leaves your secure workspace." 
          badge="SECURITY" 
        />
     </div>
  </div>
);