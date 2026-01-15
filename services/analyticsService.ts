/**
 * Standardized Analytics Service for Crispy Bacon.
 * Tracks high-signal user actions to measure retention and tool utility.
 */

type EventName = 
  | 'intel_distilled' 
  | 'voice_assistant_started'
  | 'task_toggle' 
  | 'view_change' 
  | 'share_link_created'
  | 'demo_mode_entered'
  | 'search_performed';

export const trackEvent = (eventName: EventName, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-8C16BZBZ4C', {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
};