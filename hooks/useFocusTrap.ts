
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

        // Smart Initial Focus: Look for autoFocus attribute first, then the first input, then the first button
        const initialFocus = containerRef.current.querySelector<HTMLElement>('[autoFocus]') || 
                           containerRef.current.querySelector<HTMLElement>('input, textarea, select') ||
                           containerRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')[0];

        if (initialFocus) {
          initialFocus.focus();
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
