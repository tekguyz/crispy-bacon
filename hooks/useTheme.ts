
import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * useTheme Hook
 * Synchronizes store theme state with DOM class attributes for Tailwind dark mode.
 */
export const useTheme = () => {
  const { theme } = useAppStore();

  useEffect(() => {
    const root = window.document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#2e2623'); // Charred background
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#faf9f6'); // Sandstone background
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);
};
