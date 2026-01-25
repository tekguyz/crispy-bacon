import React, { useState, useEffect, useRef } from 'react';
import { Settings, LogOut, ArrowRight, Menu, X, Globe, Cpu, Database, Zap, ShieldCheck } from 'lucide-react';
import { BaconBrand } from '../../../ui/Logo';
import { triggerHaptic } from '../../../../services/hapticService';

interface LandingNavProps {
  isScrolled: boolean;
  session: any;
  userProfile: any;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({ isScrolled, session, userProfile, onSignIn, onSignOut }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  
  const avatarUrl = session?.user?.user_metadata?.picture || userProfile?.avatar_url;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        setIsVisible(true);
      } 
      else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } 
      else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    triggerHaptic('light');
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { id: 'process', label: 'Process' },
    { id: 'features', label: 'Capabilities' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'Support' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out border-b ${
        isScrolled 
          ? 'h-16 md:h-20 bg-background/90 backdrop-blur-xl shadow-sm border-outline-variant' 
          : 'h-20 md:h-24 bg-transparent border-transparent'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container-landing h-full flex items-center justify-between">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="hover:opacity-80 transition-opacity shrink-0 py-2"
          >
            <BaconBrand className="scale-75 origin-left md:scale-90" />
          </button>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => handleNavClick(link.id)} 
                className="text-[10px] font-black text-on-background opacity-40 hover:opacity-100 transition-all tracking-[0.25em] uppercase"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center">
              {session ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowAvatarMenu(!showAvatarMenu)} 
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant hover:border-primary/40 transition-all active:scale-90 shrink-0 flex items-center justify-center shadow-sm"
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <Settings size={18} />
                      </div>
                    )}
                  </button>
                  {showAvatarMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-surface border border-outline-variant rounded-2xl shadow-2xl overflow-hidden animate-spring-up p-1.5 z-[110]">
                      <button onClick={onSignIn} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-on-background/5 text-[11px] font-bold text-on-surface uppercase tracking-widest text-left group">
                        Open Studio 
                        <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <div className="h-px bg-outline-variant my-1" />
                      <button onClick={onSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-error/5 text-[11px] font-bold text-error uppercase tracking-widest text-left">Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={onSignIn} 
                  className="px-8 h-11 bg-on-surface text-surface rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-primary transition-all active:scale-95 flex items-center gap-2"
                >
                  Sign In
                </button>
              )}
            </div>

            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-on-surface/5 text-on-surface"
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[150] transition-all duration-500 ease-spring lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-4'}`}>
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 ledger-grid opacity-[0.05]" />
        
        <div className="relative h-full flex flex-col overflow-hidden">
          <div className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-outline-variant">
            <BaconBrand className="scale-75 origin-left" />
            <button 
              onClick={toggleMobileMenu}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-on-surface/5 text-on-surface"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-8 p-6 overflow-y-auto no-scrollbar pb-24">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary opacity-40 px-4">Navigation</span>
              <div className="grid grid-cols-1 gap-1">
                {navLinks.map((link) => (
                  <button 
                    key={link.id} 
                    onClick={() => handleNavClick(link.id)} 
                    className="w-full text-left px-4 py-6 rounded-2xl hover:bg-on-surface/5 text-3xl font-black tracking-tighter uppercase transition-all flex items-center justify-between group"
                  >
                    {link.label}
                    <ArrowRight size={24} className="opacity-20" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto p-6 border-t border-outline-variant bg-background">
            <button 
              onClick={() => { onSignIn(); setIsMobileMenuOpen(false); }}
              className="w-full py-6 bg-primary text-on-primary rounded-2xl font-black text-[13px] uppercase tracking-[0.25em] shadow-xl flex items-center justify-center gap-4"
            >
              {session ? 'Studio Dashboard' : 'Start for Free'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};