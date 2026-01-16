
/**
 * Triggers a short vibration if supported by the device.
 * Respects the global intensity setting stored in localStorage.
 */
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    const intensity = parseFloat(localStorage.getItem('hapticIntensity') || '1.0');
    
    if (intensity === 0) return;

    const basePatterns = {
      light: 10,
      medium: 25,
      heavy: 50
    };

    try {
      // Scale duration by intensity (e.g. 0.5 intensity = half duration)
      const duration = Math.max(1, Math.floor(basePatterns[type] * intensity));
      navigator.vibrate(duration);
    } catch (e) {
      // Ignore vibration errors on unsupported hardware
    }
  }
};
