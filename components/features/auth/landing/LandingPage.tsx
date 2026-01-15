
import React, { useState, useEffect } from 'react';
import { LandingNav } from './LandingNav';
import { LandingHero } from './LandingHero';
import { LandingMethod } from './LandingMethod';
import { FeatureGrid } from './FeatureGrid';
import { PricingTier } from './PricingTier';
import { SmallTeamsCTA } from './SmallTeamsCTA';
import { FAQSection } from './FAQSection';
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
        {/* 1. THE HOOK */}
        <LandingHero onSignIn={onSignIn} />
        
        {/* 2. THE STRATEGY */}
        <LandingMethod />
        
        {/* 3. THE PROOF */}
        <FeatureGrid />

        {/* 4. OBJECTION HANDLING (Moved up for conversion flow) */}
        <FAQSection />

        {/* 5. THE INVESTMENT */}
        <section id="pricing" className="py-24 md:py-40 section-zebra-1 overflow-hidden">
          <div className="container-landing">
            <div className="max-w-4xl mx-auto mb-20 space-y-4 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Investment</span>
              <h2 className="text-4xl md:text-7xl font-slab font-bold tracking-tighter uppercase text-on-surface leading-none">Built for Output.</h2>
              <p className="text-lg text-on-surface-variant font-medium opacity-60">Simple pricing for high-performance leaders.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch mb-20">
               <PricingTier 
                title="Standard" price="$0" subtitle="The essential research workspace."
                features={[
                  { text: "5 Recaps per month", included: true }, 
                  { text: "Strategic Briefing Deck", included: true }, 
                  { text: "Standard Research Chat", included: true }, 
                  { text: "Snapshot Sharing", included: true },
                  { text: "Collaborative Editing", included: false }
                ]}
                extraFeatures={["Secure Cloud Vault", "15m Limit", "Markdown Export"]} 
                onAction={onSignIn}
               />
               <PricingTier 
                title="Executive" price="$20" subtitle="The permanent intelligence vault." isPro={true}
                features={[
                  { text: "Unlimited Research Recaps", included: true }, 
                  { text: "Collaborative Live Editing", included: true },
                  { text: "Live Voice Assistant", included: true }, 
                  { text: "Deep Reasoning (Pro)", included: true },
                  { text: "Full Cloud Persistence", included: true }
                ]}
                extraFeatures={["60m Limit", "Google Drive Sync", "Priority Support"]} 
                onAction={onSignIn}
               />
            </div>
            
            {/* 6. FINAL CONVERSION PUSH */}
            <SmallTeamsCTA />
          </div>
        </section>
      </main>
      
      {/* 7. FOOTER */}
      <LandingFooter onPrivacy={onPrivacy} onTerms={onTerms} onEthics={onEthics} onSignIn={onSignIn} />
    </div>
  );
};

export default LandingPage;
