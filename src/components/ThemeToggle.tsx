typescript
/**
 * ThemeToggle Component
 *
 * A production‑grade button for toggling between dark and light modes.
 * Handles asynchronous `toggleTheme` implementations, gracefully degrades
 * when the context isn’t ready or a toggle fails, and logs theme transitions
 * only after a successful change (skipping the initial mount).
 *
 * @module ThemeToggle
 */

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeContext';

// ------------------------------------------------------------------ Types
interface ThemeToggleProps {
  /** Additional CSS class name. Must be a string if provided. */
  className?: string;
}

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme | undefined;
  toggleTheme: (() => Promise<void> | void) | undefined;
}

// ------------------------------------------------------------------ Constants
const ICON_DARK = '☀️';
const ICON_LIGHT = '🌙';

/** Development‑only check. Adjust for your environment. */
const isDev = process.env.NODE_ENV === 'development';

const MESSAGES = {
  contextNotReady:
    '[ThemeToggle] toggleTheme is undefined – context may not be ready.',
  toggleAttempt: (current: string) =>
    `[ThemeToggle] toggle started, current theme = "${current}"`,
  toggleFailed: (err: unknown) =>
    `[ThemeToggle] toggleTheme threw an error – ${err instanceof Error ? err.message : String(err)}`,
  invalidClassName: '[ThemeToggle] className must be a string; ignoring.',
  themeChanged: (newTheme: string) =>
    `[ThemeToggle] theme successfully changed to "${newTheme}"`,
} as const;

// ------------------------------------------------------------------ Component
const ThemeToggle: React.FC<ThemeToggleProps> = memo(({ className }) => {
  const { theme, toggleTheme } = useTheme() as ThemeContextValue;

  // Track if the last toggle attempt failed – disables button until next success
  const [hasError, setHasError] = useState<boolean>(false);

  // Ref to hold the previous theme value, used to skip logging on initial mount
  const prevThemeRef = useRef<Theme | undefined>(undefined);

  // ------------------------------------------------------------------ Sanitise className
  const safeClassName =
    typeof className === 'string'
      ? className
      : (() => {
          if (className !== undefined && isDev) {
            console.warn(MESSAGES.invalidClassName);
          }
          return '';
        })();

  const buttonClasses = `theme-toggle${safeClassName ? ` ${safeClassName}` : ''}`;

  // ------------------------------------------------------------------ Log theme changes only when they actually occur
  useEffect(() => {
    if (theme === undefined || theme === null) return;

    // Skip the very first render (theme equals undefined initially)
    if (prevThemeRef.current === undefined) {
      prevThemeRef.current = theme;
      return;
    }

    // Only log if the theme changed
    if (prevThemeRef.current !== theme) {
      if (isDev) {
        console.info(MESSAGES.themeChanged(theme));
      }
      prevThemeRef.current = theme;
    }
  }, [theme]);

  // ------------------------------------------------------------------ Handle toggle click
  const handleToggle = useCallback(async () => {
    if (typeof toggleTheme !== 'function') {
      if (isDev) {
        console.warn(MESSAGES.contextNotReady);
      }
      return;
    }

    if (isDev) {
      console.info(MESSAGES.toggleAttempt(theme ?? 'light'));
    }

    try {
      // Await the result in case toggleTheme is asynchronous
      await toggleTheme();

      // Clear any previous error state after a successful toggle
      if (hasError) {
        setHasError(false);
      }
    } catch (err) {
      if (isDev) {
        console.error(MESSAGES.toggleFailed(err));
      }
      setHasError(true);
    }
  }, [theme, toggleTheme, hasError]);

  // ------------------------------------------------------------------ Derive UI values
  const targetMode: Theme = theme === 'dark' ? 'light' : 'dark';
  const ariaLabel = `Switch to ${targetMode} mode`;
  const icon = theme === 'dark' ? ICON_DARK : ICON_LIGHT;

  // ------------------------------------------------------------------ Disabled fallback
  const renderDisabled = (): JSX.Element => (
    <button
      className={buttonClasses}
      disabled
      aria-label={ariaLabel}
      aria-disabled="true"
      title={
        hasError
          ? 'Theme toggle failed – click again to retry'
          : 'Theme toggle unavailable – context loading…'
      }
    >
      {icon}
    </button>
  );

  // ------------------------------------------------------------------ Render
  if (typeof toggleTheme !== 'function' || hasError) {
    if (hasError && isDev) {
      console.warn('[ThemeToggle] last toggle attempt failed – button is disabled.');
    }
    return renderDisabled();
  }

  return (
    <button
      className={buttonClasses}
      onClick={handleToggle}
      aria-label={ariaLabel}
      data-testid="theme-toggle-button"
    >
      {icon}
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;