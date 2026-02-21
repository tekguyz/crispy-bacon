
import React, { useState, useEffect } from 'react';
import { LandingNav } from './LandingNav';
import { LandingHero } from './LandingHero';
import { LandingFeatures } from './LandingFeatures';
import { FAQSection } from './FAQSection';
import { PricingTier } from './PricingTier';
import { SmallTeamsCTA } from './SmallTeamsCTA';
import { LandingFooter } from './LandingFooter';
import { useAppStore } from '../../../../store/useAppStore';

const LandingPage: React.FC<any> = ({ onSignIn, onPrivacy, onTerms, onEthics }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { session, userProfile, signOut } = useAppStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary/20 selection:text-primary font-sans relative">
      <LandingNav isScrolled={isScrolled} session={session} userProfile={userProfile} onSignIn={onSignIn} onSignOut={signOut} />
      
      <main className="overflow-x-hidden">
        <LandingHero onSignIn={onSignIn} />
        
        <LandingFeatures />

        <section id="pricing" className="py-24 md:py-32 bg-background border-b border-outline-variant/10 relative">
          <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />
          
          <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
            
            {/* Center-Aligned Header */}
            <div className="mb-20 max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-8 md:w-12 bg-primary/40" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-primary">Access Levels</span>
                  <div className="h-px w-8 md:w-12 bg-primary/40" />
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter uppercase text-on-surface leading-[0.9]">
                  Serious Tools. <br/> Simple <span className="text-primary italic">Pricing.</span>
              </h2>
              <p className="mt-6 text-lg font-serif font-medium text-on-surface-variant opacity-60 max-w-2xl mx-auto leading-relaxed">
                Choose the capacity that fits your research needs. Upgrade or cancel anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
               <PricingTier 
                title="Standard" price="Free" subtitle="Essential research bandwidth."
                features={[
                  { text: "5 Recaps per month", included: true }, 
                  { text: "Executive Summaries", included: true }, 
                  { text: "Standard Chat", included: true }, 
                  { text: "Markdown Export", included: true },
                  { text: "Voice Assistant", included: false }
                ]}
                onAction={onSignIn}
               />
               <PricingTier 
                title="Executive" price="$20" subtitle="Permanent intelligence vault." isPro={true}
                features={[
                  { text: "Unlimited Recaps", included: true }, 
                  { text: "Deep Reasoning Model", included: true },
                  { text: "Live Voice Assistant", included: true }, 
                  { text: "Collaborative Editing", included: true },
                  { text: "Priority Support", included: true }
                ]}
                onAction={onSignIn}
               />
            </div>
            
            <SmallTeamsCTA />
          </div>
        </section>

        <FAQSection />
      </main>
      
      <LandingFooter onPrivacy={onPrivacy} onTerms={onTerms} onEthics={onEthics} onSignIn={onSignIn} />
    </div>
  );
};

export default LandingPage;
