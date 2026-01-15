
/**
 * Triggers a short vibration if supported by the device.
 * Used to confirm tactical actions like task completion.
 */
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 25,
      heavy: 50
    };
    try {
      navigator.vibrate(patterns[type]);
    } catch (e) {
      // Ignore vibration errors on unsupported hardware
    }
  }
};
