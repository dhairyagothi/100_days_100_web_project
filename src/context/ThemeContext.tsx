tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

/**
 * Supported theme values.
 */
type Theme = 'light' | 'dark';

/**
 * Shape of the theme context value.
 */
interface ThemeContextValue {
  /** Current active theme. */
  theme: Theme;
  /** Function to toggle between light and dark themes. */
  toggleTheme: () => void;
}

/**
 * Storage key used for persisting the theme preference.
 */
const THEME_STORAGE_KEY = 'theme';

/**
 * Default theme applied when no stored preference exists or on error.
 */
const DEFAULT_THEME: Theme = 'light';

/**
 * React context for theme management.
 * Undefined when accessed outside a provider.
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Props for the ThemeProvider component.
 */
interface ThemeProviderProps {
  /** Application subtree that will have access to theme context. */
  children: React.ReactNode;
}

/**
 * Applies the theme class to the document root element (`<html>`) and
 * sets a CSS custom property for the color-scheme to support native UI elements.
 *
 * @param theme - The current theme to apply.
 */
function applyThemeToDocument(theme: Theme): void {
  try {
    const root = document.documentElement;
    if (!root) {
      console.warn('Document root element is not available');
      return;
    }

    // Remove the opposite theme class to avoid conflicts
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);

    // Inform browsers about the preferred color scheme (affects scrollbars, etc.)
    root.style.colorScheme = theme;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to apply theme to document: ${message}`);
  }
}

/**
 * ThemeProvider wraps the application and provides theme state and toggle functionality.
 * It persists the theme preference in `localStorage` and initializes from it if available.
 * Falls back to `'light'` if no stored preference exists or if an error occurs.
 * Additionally, it applies the theme class to the `<html>` element and sets
 * the `color-scheme` CSS property for consistent native UI styling.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Failed to read theme from localStorage: ${message}`);
    }
    return DEFAULT_THEME;
  });

  // Apply the theme class and CSS custom property whenever theme changes
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  // Persist theme changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Failed to persist theme to localStorage: ${message}`);
    }
  }, [theme]);

  /**
   * Toggles between light and dark themes using functional update to avoid stale closures.
   */
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme: Theme): Theme => {
      return prevTheme === 'light' ? 'dark' : 'light';
    });
  }, []);

  const value: ThemeContextValue = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook that returns the current theme and the toggle function.
 * Must be used within a `ThemeProvider`; otherwise it throws an error.
 *
 * @returns {ThemeContextValue} An object containing `theme` and `toggleTheme`.
 * @throws {Error} If used outside of `ThemeProvider`.
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};