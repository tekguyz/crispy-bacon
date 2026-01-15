
import React from 'react';
import { InsightTemplate } from '../../../types';
import { GoalSelector } from './GoalSelector';
import { DepthToggle } from './DepthToggle';

interface StudioControlsProps {
  includeSystemAudio: boolean;
  onSetIncludeSystem: (val: boolean) => void;
  selectedTemplate: InsightTemplate;
  onSetTemplate: (t: InsightTemplate) => void;
  disabled: boolean;
  isPro: boolean;
}

export const StudioControls: React.FC<StudioControlsProps> = ({
  selectedTemplate, onSetTemplate, disabled, isPro
}) => {
  return (
    <div className={`space-y-5 transition-opacity duration-300 ${disabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
      <DepthToggle isPro={isPro} />
      
      <div className="h-px bg-outline-variant/10 w-full" />
      
      <GoalSelector 
        selectedTemplate={selectedTemplate} 
        onSetTemplate={onSetTemplate} 
        disabled={false} 
        isPro={isPro}
      />
    </div>
  );
};
