export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'movolette.theme.v1';
const THEME_COLORS: Record<Theme, string> = {
  dark: '#171715',
  light: '#F7F6F2',
};

export const DEFAULT_THEME: Theme = 'dark';

export function readTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  } catch {
    return DEFAULT_THEME;
  }
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLORS[theme]);
}

export function writeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* Private browsing can reject storage; the theme still applies for this visit. */
  }
  applyTheme(theme);
}

export function otherTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}
