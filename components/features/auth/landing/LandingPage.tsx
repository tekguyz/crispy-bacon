
import React, { useState, useEffect } from 'react';
import { LandingNav } from './LandingNav';
import { LandingHero } from './LandingHero';
import { TheInstrument } from './TheInstrument';
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
        
        <TheInstrument />

        <section id="pricing" className="py-24 bg-surface-container-lowest/50 border-t border-outline-variant/10">
          <div className="container-landing">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter uppercase text-on-surface">Membership</h2>
              <p className="text-xs font-bold text-on-surface-variant opacity-50 uppercase tracking-widest">Simple pricing for serious work.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
            
            <div className="mt-20">
               <SmallTeamsCTA />
            </div>
          </div>
        </section>
      </main>
      
      <LandingFooter onPrivacy={onPrivacy} onTerms={onTerms} onEthics={onEthics} onSignIn={onSignIn} />
    </div>
  );
};

export default LandingPage;
