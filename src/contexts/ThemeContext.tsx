tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from 'react';

// ------------------------------------------------------------------
// Logger (production-ready, extensible)
// ------------------------------------------------------------------
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

const currentLevel: LogLevel =
  (process.env.REACT_APP_LOG_LEVEL as LogLevel) || 'info';

const logger = {
  debug: (...args: unknown[]) => {
    if (LOG_LEVELS[currentLevel] <= LOG_LEVELS.debug) {
      console.debug('[ThemeProvider]', ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (LOG_LEVELS[currentLevel] <= LOG_LEVELS.info) {
      console.info('[ThemeProvider]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (LOG_LEVELS[currentLevel] <= LOG_LEVELS.warn) {
      console.warn('[ThemeProvider]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (LOG_LEVELS[currentLevel] <= LOG_LEVELS.error) {
      console.error('[ThemeProvider]', ...args);
    }
  },
};

// ------------------------------------------------------------------
// Types & Interfaces
// ------------------------------------------------------------------
type Theme = 'light' | 'dark';

interface ThemeContextValue {
  /** Current active theme */
  theme: Theme;
  /** Toggles between light and dark themes */
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
  /**
   * Initial theme value when no persisted state is found or as fallback.
   * If not provided, defaults to system preference or 'light'.
   * The provider will update its internal state if this prop changes after mount,
   * unless the user has manually toggled the theme.
   */
  initialTheme?: Theme;
  /** Enable listening to OS system preference changes (default: false) */
  followSystemPreference?: boolean;
}

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------
const STORAGE_KEY = 'theme' as const;
const THEME_ATTRIBUTE = 'data-theme' as const;
const THEME_VALUES: readonly Theme[] = ['light', 'dark'];
const DEFAULT_INITIAL_THEME: Theme = 'light';

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

/**
 * Validates that a given value is one of the supported themes.
 * Returns the value cast to Theme if valid, otherwise returns the fallback.
 *
 * @param value   - Value to validate.
 * @param fallback- Theme to fall back on if validation fails.
 * @returns A valid Theme.
 */
function validateTheme(value: unknown, fallback: Theme): Theme {
  if (THEME_VALUES.includes(value as Theme)) {
    return value as Theme;
  }
  logger.warn(
    `Invalid theme value "${String(value)}", falling back to "${fallback}"`
  );
  return fallback;
}

/**
 * Safely checks if `window` is defined (SSR guard).
 *
 * @returns True if running in a browser environment.
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Retrieves the persisted theme from localStorage.
 * Returns null if localStorage is unavailable, unreadable, or no value is set.
 *
 * @returns The persisted theme if valid, otherwise null.
 */
function getPersistedTheme(): Theme | null {
  if (!isBrowser()) {
    logger.debug('Not in browser – skipping localStorage read');
    return null;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      return validateTheme(stored, DEFAULT_INITIAL_THEME);
    }
  } catch (err) {
    logger.error('Failed to read theme from localStorage', err);
  }
  return null;
}

/**
 * Persists the given theme to localStorage.
 * Fails silently on storage errors or if not in browser.
 *
 * @param theme - The theme to persist.
 */
function persistTheme(theme: Theme): void {
  if (!isBrowser()) {
    logger.debug('Not in browser – skipping localStorage write');
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
    logger.debug('Theme persisted:', theme);
  } catch (err) {
    logger.warn('Failed to persist theme to localStorage', err);
  }
}

/**
 * Applies the theme to the document root element by setting a data attribute.
 * Does nothing if `document` is undefined (e.g., SSR).
 *
 * @param theme - Theme to apply.
 */
function applyThemeToDOM(theme: Theme): void {
  if (typeof document === 'undefined') return;
  try {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
    logger.debug('Applied theme to DOM:', theme);
  } catch (err) {
    logger.error('Failed to apply theme to DOM', err);
  }
}

/**
 * Retrieves the user's preferred theme from the OS/browser setting.
 * Returns the preferred theme if available, otherwise null.
 *
 * @returns The preferred theme or null.
 */
function getSystemPreference(): Theme | null {
  if (!isBrowser() || !window.matchMedia) {
    logger.debug('matchMedia unavailable – skipping system preference');
    return null;
  }
  try {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    return prefersDark.matches ? 'dark' : 'light';
  } catch (err) {
    logger.warn('Failed to read system color scheme preference', err);
    return null;
  }
}

/**
 * Determines the initial theme using the following priority:
 * 1. Persisted value from localStorage (if valid)
 * 2. `initialTheme` prop (if provided)
 * 3. System preference (if available)
 * 4. Default fallback ('light')
 *
 * @param propInitialTheme - The value of the `initialTheme` prop.
 * @returns The resolved initial theme.
 */
function resolveInitialTheme(propInitialTheme?: Theme): Theme {
  const persisted = getPersistedTheme();
  if (persisted !== null) {
    logger.debug('Using persisted theme:', persisted);
    return persisted;
  }
  if (propInitialTheme !== undefined) {
    const validated = validateTheme(propInitialTheme, DEFAULT_INITIAL_THEME);
    logger.debug('Using initial theme prop:', validated);
    return validated;
  }
  const system = getSystemPreference();
  if (system !== null) {
    logger.debug('Using system preference:', system);
    return system;
  }
  logger.debug('Using default theme:', DEFAULT_INITIAL_THEME);
  return DEFAULT_INITIAL_THEME;
}

// ------------------------------------------------------------------
// Context
// ------------------------------------------------------------------
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ------------------------------------------------------------------
// Custom Hook for consuming the context
// ------------------------------------------------------------------

/**
 * Hook to access the current theme and toggle function.
 * Must be used inside a <ThemeProvider>.
 *
 * @returns {ThemeContextValue} The theme context value.
 * @throws Error if used outside the provider.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// ------------------------------------------------------------------
// Provider Component
// ------------------------------------------------------------------

/**
 * ThemeProvider manages the current theme (light/dark), provides a toggle
 * function, and automatically persists the theme to localStorage and applies
 * it to `document.documentElement`.
 *
 * The initial theme is determined by the following priority:
 * 1. Persisted value from localStorage (if valid)
 * 2. `initialTheme` prop (if provided)
 * 3. System preference via `prefers-color-scheme` (if available and no prop/localStorage)
 * 4. Default fallback ('light')
 *
 * The provider handles SSR gracefully by checking for `window` and `document`
 * before accessing browser-specific APIs.
 *
 * If the `initialTheme` prop changes after mount, the provider will sync
 * its internal state to the new prop unless a user-initiated theme
 * toggle has occurred (tracked via internal flag).
 *
 * When `followSystemPreference` is true, the provider will listen to changes
 * in the OS color scheme and update the theme accordingly, but only if no
 * user toggle has happened since the last sync.
 *
 * @param props - The provider props.
 * @returns The provider component.
 */
export function ThemeProvider({
  children,
  initialTheme,
  followSystemPreference = false,
}: ThemeProviderProps): React.ReactElement {
  // Track whether the user has manually toggled the theme (to avoid overwriting)
  const [userToggled, setUserToggled] = useState<boolean>(false);

  // Resolve initial theme using the priority logic
  const [theme, setTheme] = useState<Theme>(() =>
    resolveInitialTheme(initialTheme)
  );

  // Ref to track if this is the first render (to skip effects on mount)
  const isFirstRender = React.useRef<boolean>(true);

  // ------------------------------------------------------------------
  // Apply theme to DOM and persist when it changes
  // ------------------------------------------------------------------
  useEffect(() => {
    applyThemeToDOM(theme);
    persistTheme(theme);
  }, [theme]);

  // ------------------------------------------------------------------
  // Sync with initialTheme prop changes only before any user toggle
  // ------------------------------------------------------------------
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only sync if user hasn't toggled manually
    if (!userToggled && initialTheme !== undefined) {
      const validated = validateTheme(initialTheme, DEFAULT_INITIAL_THEME);
      if (validated !== theme) {
        logger.info(
          'initialTheme prop changed, syncing theme to:',
          validated
        );
        setTheme(validated);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTheme, userToggled]);

  // ------------------------------------------------------------------
  // Listen to system preference changes (optional)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!followSystemPreference || !isBrowser() || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent): void => {
      // Only apply system change if user hasn't toggled manually
      if (!userToggled) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        logger.debug('System preference changed to:', newTheme);
        setTheme(newTheme);
      }
    };

    // Modern browsers support addEventListener; fallback for older
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Deprecated but present in older versions
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [followSystemPreference, userToggled]);

  // ------------------------------------------------------------------
  // Toggle function – marks that user has manually toggled
  // ------------------------------------------------------------------
  const toggleTheme = useCallback(() => {
    setUserToggled(true);
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // ------------------------------------------------------------------
  // Memoized context value
  // ------------------------------------------------------------------
  const contextValue = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme]
  );

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.defaultProps = {
  initialTheme: undefined,
  followSystemPreference: false,
};