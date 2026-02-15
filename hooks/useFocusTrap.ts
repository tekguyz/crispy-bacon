
import { useEffect, useRef } from 'react';

/**
 * Custom hook to trap focus within a container and restore focus upon closing.
 * Optimized for React 19 and enhanced ARIA compliance.
 */
export const useFocusTrap = (isActive: boolean, onClose?: () => void) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isActive) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && onCloseRef.current) {
          onCloseRef.current();
          return;
        }

        if (e.key !== 'Tab' || !containerRef.current) return;

        // Expanded selector for professional-grade focus trapping
        const focusableSelectors = [
          'button:not([disabled])',
          '[href]',
          'input:not([disabled])',
          'select:not([disabled])',
          'textarea:not([disabled])',
          '[tabindex]:not([tabindex="-1"])',
          '[contenteditable]',
          'details'
        ].join(',');

        const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors);
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      
      // Intentional delay to ensure DOM is painted before stealing focus
      const timer = setTimeout(() => {
        if (!containerRef.current) return;

        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

        // Smart Initial Focus: 
        // 1. Desktop: Prefer explicit autoFocus, then inputs, then buttons.
        // 2. Mobile: Avoid inputs/textareas to prevent keyboard popups. Prefer buttons/interactive elements.
        
        let initialFocus: HTMLElement | null = null;

        // Priority 1: Explicit autoFocus (Only on Desktop)
        if (!isMobile) {
          initialFocus = containerRef.current.querySelector<HTMLElement>('[autoFocus]');
        }

        // Priority 2: First Input/Textarea (Only on Desktop)
        if (!initialFocus && !isMobile) {
           initialFocus = containerRef.current.querySelector<HTMLElement>('input, textarea, select');
        }

        // Priority 3: Fallback to Buttons/Interactive (Safe for Mobile)
        if (!initialFocus) {
           // Find the first interactive element that isn't an input/textarea if we are on mobile? 
           // actually the logic below finds the first match of ANY focusable.
           // On mobile we want to find the first NON-input focusable if possible, or just the first focusable and accept it might be input if nothing else exists.
           // But usually there is a Close button or similar.
           
           const allFocusables = containerRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])'); // Excluded inputs here for the fallback selector
           if (allFocusables.length > 0) {
             initialFocus = allFocusables[0];
           } else {
             // Absolute fallback if only inputs exist (rare in modals which usually have close buttons)
             initialFocus = containerRef.current.querySelectorAll<HTMLElement>('input, textarea, select')[0];
           }
        }

        if (initialFocus) {
          initialFocus.focus({ preventScroll: true });
        }
      }, 50);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
        
        // Restore focus to the initiating element
        const prevFocus = previousFocusRef.current;
        if (prevFocus && document.body.contains(prevFocus)) {
          setTimeout(() => prevFocus.focus(), 0);
        }
      };
    }
  }, [isActive]);

  return containerRef;
};
