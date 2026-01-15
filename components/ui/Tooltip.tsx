import React, { ReactNode, useState, useRef, useEffect, useLayoutEffect } from 'react';

interface TooltipProps {
  content: string;
  children?: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  delay?: number;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  side = 'top', 
  className = '', 
  delay = 300,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      );
    };
    setIsTouchDevice(checkTouch());
  }, []);

  useLayoutEffect(() => {
    if (isVisible && containerRef.current && tooltipRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const padding = 12;
      
      let top = 0;
      let left = 0;

      switch (side) {
        case 'top':
          top = containerRect.top - tooltipRect.height - padding;
          left = containerRect.left + (containerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = containerRect.bottom + padding;
          left = containerRect.left + (containerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = containerRect.top + (containerRect.height / 2) - (tooltipRect.height / 2);
          left = containerRect.left - tooltipRect.width - padding;
          break;
        case 'right':
          top = containerRect.top + (containerRect.height / 2) - (tooltipRect.height / 2);
          left = containerRect.left + containerRect.width + padding;
          break;
      }

      // Viewport Collision Guard
      if (left < padding) left = padding;
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
      }
      if (top < padding) top = padding;
      if (top + tooltipRect.height > window.innerHeight - padding) {
        top = window.innerHeight - tooltipRect.height - padding;
      }

      setPosition({ top, left });
    }
  }, [isVisible, side, content]);

  const show = () => {
    if (isTouchDevice || !content || disabled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  if (!content || disabled) return <>{children}</>;

  return (
    <div 
      ref={containerRef}
      className={`inline-flex ${className}`} 
      onMouseEnter={show} 
      onMouseLeave={hide} 
      onFocus={show} 
      onBlur={hide}
    >
      {children}
      {isVisible && (
        <div 
          ref={tooltipRef}
          role="tooltip" 
          aria-hidden="true"
          className="fixed z-[9999] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-expressive shadow-2xl whitespace-nowrap pointer-events-none animate-fade-in select-none border border-outline-variant/20 backdrop-blur-xl ring-1 ring-black/10 transition-all duration-300 ease-spring bg-surface-container-high text-on-surface"
          style={{ 
             top: `${position.top}px`,
             left: `${position.left}px`,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};