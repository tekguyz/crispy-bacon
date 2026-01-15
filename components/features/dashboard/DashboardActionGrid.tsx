
import React from 'react';
import { Mic, Globe, Activity, Plus, ArrowRight, Zap, Target, Upload, Command, Calendar } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { AppView, ContentType } from '../../../types';
import CalendarSync from './CalendarSync';
import { signInWithGoogle } from '../../../services/supabaseClient';

interface ActionGridProps {
  isPro: boolean;
  isInitialLoading: boolean;
  recentInsights: any[];
  allMeetings: any[];
}

export const DashboardActionGrid: React.FC<ActionGridProps> = ({ 
  isPro, isInitialLoading, allMeetings 
}) => {
  const { 
    setShowCaptureLab, setShowUpgradeModal, setCurrentNote, session, fetchCalendarMeetings
  } = useAppStore();

  return (
    <section className="flex flex-col gap-4 animate-spring-up">
        <CalendarSync 
            isPro={isPro}
            isLoading={isInitialLoading} 
            meetings={allMeetings} 
            onRefresh={fetchCalendarMeetings} 
            onReauth={signInWithGoogle}
            onUpgrade={() => setShowUpgradeModal(true)}
            onPrepare={(m) => {
                setCurrentNote(`Meeting: ${m.summary}\nLocation: ${m.location || 'Online'}\n\n`);
                setShowCaptureLab(true);
            }}
        />
    </section>
  );
};
