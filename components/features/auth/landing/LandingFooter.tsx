
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BaconBrand } from '../../../ui/Logo';
import { COPYRIGHT_YEAR } from '../../../../constants/version';

export const LandingFooter: React.FC<any> = ({ onPrivacy, onTerms, onEthics, onSignIn }) => {
  return (
    <footer className="bg-background border-t border-outline-variant/10 relative overflow-hidden pt-20 pb-10">
        {/* Subtle Background Texture */}
        <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />

        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                
                {/* Brand Column */}
                <div className="md:col-span-5 space-y-6">
                    <BaconBrand />
                    <p className="text-sm font-serif font-medium text-on-surface-variant opacity-60 max-w-xs leading-relaxed">
                        A professional research instrument designed for high-performance leadership. 
                        We turn noise into signal.
                    </p>
                    <div className="flex items-center gap-2 pt-2 opacity-60">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">
                            All Systems Operational
                        </span>
                    </div>
                </div>

                {/* Spacer */}
                <div className="md:col-span-1" />

                {/* Links Grid */}
                <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-4">
                    
                    {/* Product */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-primary">Product</h4>
                        <ul className="space-y-3">
                            <li><button onClick={() => document.getElementById('process')?.scrollIntoView({behavior: 'smooth'})} className="text-xs font-bold text-on-surface hover:text-primary transition-colors uppercase tracking-wide">Process</button></li>
                            <li><button onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})} className="text-xs font-bold text-on-surface hover:text-primary transition-colors uppercase tracking-wide">Capabilities</button></li>
                            <li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'})} className="text-xs font-bold text-on-surface hover:text-primary transition-colors uppercase tracking-wide">Pricing</button></li>
                            <li><button onClick={onSignIn} className="text-xs font-bold text-on-surface hover:text-primary transition-colors uppercase tracking-wide">Login</button></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-primary">Legal</h4>
                        <ul className="space-y-3">
                            <li><button onClick={onPrivacy} className="text-xs font-bold text-on-surface hover:text-primary transition-colors uppercase tracking-wide">Privacy Policy</button></li>
                            <li><button onClick={onTerms} className="text-xs font-bold text-on-surface hover:text-primary transition-colors uppercase tracking-wide">Terms of Service</button></li>
                            <li><button onClick={onEthics} className="text-xs font-bold text-on-surface hover:text-primary transition-colors uppercase tracking-wide">AI Ethics</button></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-primary">Connect</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="mailto:hello@crispybacon.ai" className="text-xs font-bold text-on-surface hover:text-primary transition-colors uppercase tracking-wide flex items-center gap-1 group">
                                    Contact Sales <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                            <li>
                                <button onClick={onSignIn} className="text-xs font-bold text-on-surface hover:text-primary transition-colors uppercase tracking-wide flex items-center gap-1 group">
                                    Support <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-20 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant/40">
                <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em]">
                    &copy; {COPYRIGHT_YEAR} Crispy Bacon Labs.
                </p>
                <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em]">
                    v2.5.1 // Build 8842
                </p>
            </div>
        </div>
    </footer>
  );
};
