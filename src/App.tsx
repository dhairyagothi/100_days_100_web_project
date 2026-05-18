tsx
import React, { useEffect, useContext, useState, Component, ErrorInfo, ReactNode } from 'react';
import { ThemeContext } from './context/ThemeContext';

// Re-export ThemeProvider for convenience
export { ThemeProvider } from './context/ThemeContext';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const THEME_STORAGE_KEY = 'app-theme' as const;
const THEME_ATTRIBUTE = 'data-theme' as const;
const DEFAULT_THEME = 'light' as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Theme = 'light' | 'dark';

interface AppProps {
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Utility – get initial theme from user preference or localStorage
// ---------------------------------------------------------------------------

/**
 * Retrieves the initial theme, prioritising:
 * 1. localStorage saved value
 * 2. System colour scheme preference (prefers-color-scheme)
 * 3. Fallback to DEFAULT_THEME
 *
 * @returns {Theme} The initial theme value.
 */
function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // localStorage unavailable – fall through to system detection
  }

  if (window?.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  return DEFAULT_THEME;
}

// ---------------------------------------------------------------------------
// Persistent Logger (controlled verbosity in production)
// ---------------------------------------------------------------------------

const isDev = process.env.NODE_ENV === 'development';

/**
 * Logs a message with a given severity level.
 * In production, only errors and warnings are logged (info is suppressed).
 *
 * @param {'error' | 'warn' | 'info'} level - Log severity.
 * @param {...unknown[]} args - Arguments to log.
 */
function log(level: 'error' | 'warn' | 'info', ...args: unknown[]): void {
  if (!isDev && level === 'info') return;
  const method = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  method(`[ThemeManager]`, ...args);
}

// ---------------------------------------------------------------------------
// Error Boundary – captures rendering errors in children
// ---------------------------------------------------------------------------

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * A React error boundary that catches JavaScript errors in its child component tree.
 * Logs the error and displays a fallback UI.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    log('error', 'Error boundary caught an exception', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Optional custom fallback UI
      return this.props.fallback ?? <div>Something went wrong. Please try refreshing the page.</div>;
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// ThemeEffect – applies theme to document root and persists changes
// ---------------------------------------------------------------------------

/**
 * Listens for theme changes from ThemeContext and synchronises them with:
 * - `<html>` element `data-theme` attribute
 * - LocalStorage for persistence
 * - Console logging for debugging (development only)
 *
 * If ThemeContext is not provided (undefined), it falls back to the system preference.
 */
const ThemeEffect: React.FC = () => {
  const context = useContext(ThemeContext);
  // Fallback if context is missing (e.g., used outside <ThemeProvider>)
  const theme: Theme = context?.theme ?? getInitialTheme();

  useEffect(() => {
    try {
      // Validate theme value – defensive check
      if (theme !== 'light' && theme !== 'dark') {
        throw new Error(`Invalid theme value: "${theme}"`);
      }

      // Apply as data attribute (consistent with ThemeProvider)
      document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);

      // Persist to localStorage
      localStorage.setItem(THEME_STORAGE_KEY, theme);

      log('info', `Theme applied: ${theme}`);
    } catch (error) {
      log('error', 'Failed to apply theme', error);
    }
  }, [theme]);

  return null;
};

// ---------------------------------------------------------------------------
// App Component – wraps application with ThemeProvider and theme sync
// ---------------------------------------------------------------------------

/**
 * Root application component.
 *
 * Provides the theme context to all children and synchronises the current
 * theme with the document root (`data-theme` attribute) and localStorage.
 * Also detects system colour scheme preference on initial load.
 *
 * @param {AppProps} props - Component properties.
 * @returns {JSX.Element} The rendered application tree.
 */
const App: React.FC<AppProps> = ({ children }) => {
  // Detect initial theme once on mount
  const [initialTheme] = useState<Theme>(getInitialTheme);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme={initialTheme}>
        <ThemeEffect />
        {children}
      </ThemeProvider>
    </ErrorBoundary>
  );
};

// ---------------------------------------------------------------------------
// Defensive wrapper – handles missing ThemeContext gracefully
// ---------------------------------------------------------------------------

/**
 * A safer version of ThemeEffect that works even when ThemeContext is not provided.
 * Useful for standalone usage or testing.
 */
const SafeThemeEffect: React.FC = () => {
  let theme: Theme;
  try {
    const context = useContext(ThemeContext);
    theme = context?.theme ?? getInitialTheme();
  } catch {
    theme = getInitialTheme();
  }

  useEffect(() => {
    try {
      document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      log('info', `Safe fallback theme applied: ${theme}`);
    } catch (error) {
      log('error', 'Failed to apply safe fallback theme', error);
    }
  }, [theme]);

  return null;
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { SafeThemeEffect, ErrorBoundary };
export default App;