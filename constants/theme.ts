
import { AccentColor } from '../types';

export interface ColorPalette {
  light: Record<string, string>;
  dark: Record<string, string>;
}

export const ACCENT_OPTIONS: { id: AccentColor; label: string; colorClass: string }[] = [
  { id: 'orange', label: 'Bacon', colorClass: 'bg-orange-500' },
  { id: 'blue', label: 'Ocean', colorClass: 'bg-blue-500' },
  { id: 'green', label: 'Forest', colorClass: 'bg-green-600' },
  { id: 'purple', label: 'Royal', colorClass: 'bg-purple-500' },
  { id: 'red', label: 'Heat', colorClass: 'bg-red-500' },
];

/**
 * Material 3 Expressive Palettes
 * Optimized for the Sandstone/Charcoal base.
 */
export const ACCENT_PALETTES: Record<AccentColor, ColorPalette> = {
  orange: {
    light: {
      '--primary': 'oklch(0.62 0.21 45)',
      '--primary-foreground': 'oklch(1 0 0)',
      '--muted': 'oklch(0.95 0.01 45)',
      '--muted-foreground': 'oklch(0.45 0.02 45)',
    },
    dark: {
      '--primary': 'oklch(0.72 0.18 45)',
      '--primary-foreground': 'oklch(0.15 0.02 45)',
      '--muted': 'oklch(0.25 0.02 45)',
      '--muted-foreground': 'oklch(0.7 0.01 45)',
    }
  },
  blue: {
    light: {
      '--primary': 'oklch(0.55 0.15 250)',
      '--primary-foreground': 'oklch(1 0 0)',
      '--muted': 'oklch(0.95 0.01 250)',
      '--muted-foreground': 'oklch(0.45 0.05 250)',
    },
    dark: {
      '--primary': 'oklch(0.65 0.14 250)',
      '--primary-foreground': 'oklch(0.15 0.02 250)',
      '--muted': 'oklch(0.22 0.02 250)',
      '--muted-foreground': 'oklch(0.75 0.03 250)',
    }
  },
  green: {
    light: {
      '--primary': 'oklch(0.52 0.14 145)',
      '--primary-foreground': 'oklch(1 0 0)',
      '--muted': 'oklch(0.95 0.01 145)',
      '--muted-foreground': 'oklch(0.45 0.05 145)',
    },
    dark: {
      '--primary': 'oklch(0.62 0.12 145)',
      '--primary-foreground': 'oklch(0.15 0.02 145)',
      '--muted': 'oklch(0.22 0.02 145)',
      '--muted-foreground': 'oklch(0.75 0.03 145)',
    }
  },
  purple: {
    light: {
      '--primary': 'oklch(0.55 0.18 290)',
      '--primary-foreground': 'oklch(1 0 0)',
      '--muted': 'oklch(0.95 0.01 290)',
      '--muted-foreground': 'oklch(0.45 0.05 290)',
    },
    dark: {
      '--primary': 'oklch(0.65 0.16 290)',
      '--primary-foreground': 'oklch(0.15 0.02 290)',
      '--muted': 'oklch(0.22 0.02 290)',
      '--muted-foreground': 'oklch(0.75 0.03 290)',
    }
  },
  red: {
    light: {
      '--primary': 'oklch(0.55 0.22 25)',
      '--primary-foreground': 'oklch(1 0 0)',
      '--muted': 'oklch(0.95 0.01 25)',
      '--muted-foreground': 'oklch(0.45 0.05 25)',
    },
    dark: {
      '--primary': 'oklch(0.65 0.20 25)',
      '--primary-foreground': 'oklch(0.15 0.02 25)',
      '--muted': 'oklch(0.22 0.02 25)',
      '--muted-foreground': 'oklch(0.75 0.03 25)',
    }
  }
};
