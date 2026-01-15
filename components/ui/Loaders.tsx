import React from 'react';
import { BaconLogo } from './Logo';

/**
 * BaconLoader
 * Professional, high-density visualization for active work.
 */
export const BaconLoader = () => (
  <div className="relative w-24 h-24 flex items-center justify-center p-2">
    <div className="absolute inset-1.5 border-[3px] border-surface-container-highest rounded-full opacity-20" />
    <div className="absolute inset-0 w-full h-full rounded-full border-[4px] border-transparent border-t-primary border-r-primary/50 animate-spin-slow" />
    <div className="absolute inset-4 w-16 h-16 rounded-full border-[3px] border-transparent border-b-primary border-l-primary/30 animate-spin-reverse" />
    <div className="relative z-10 w-8 h-8 bg-primary/10 rounded-lg border border-primary/20 backdrop-blur-sm flex items-center justify-center animate-pulse-gentle transform rotate-45">
       <div className="w-2.5 h-2.5 bg-primary rounded-[2px] shadow-sm shadow-primary/50" />
    </div>

    <style>{`
      @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes spin-reverse { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
      @keyframes pulse-gentle { 
        0%, 100% { transform: rotate(45deg) scale(1); opacity: 1; } 
        50% { transform: rotate(45deg) scale(0.95); opacity: 0.8; } 
      }
      .animate-spin-slow { animation: spin-slow 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      .animate-spin-reverse { animation: spin-reverse 3s linear infinite; }
      .animate-pulse-gentle { animation: pulse-gentle 2s ease-in-out infinite; }
    `}</style>
  </div>
);

export const BaconWarmupLoader = () => (
  <div className="flex flex-col items-center justify-center p-8 animate-fade-in space-y-6">
    <div className="relative">
      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
      <div className="relative animate-wiggle">
        <BaconLogo className="w-20 h-20" />
      </div>
    </div>
    <div className="text-center space-y-2">
      <p className="text-sm font-black text-on-surface uppercase tracking-widest italic leading-tight">Opening your library...</p>
      <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-[0.2em]">Almost ready.</p>
    </div>
    <style>{`
      @keyframes wiggle {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
      }
      .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
    `}</style>
  </div>
);