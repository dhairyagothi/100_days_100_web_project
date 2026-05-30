*/
const ThemeToggleButton: FC = () => {
  const { theme, toggleTheme } = useTheme();

  /**
   * Handles the toggle click event.
   *
   * Captures the current theme before toggling, calls the toggle function,
   * and logs the transition. Catches and logs any errors thrown during
   * the toggle process.
   *
   * @remarks
   * The handler is memoized with `useCallback` to maintain stable reference
   * across renders, but it will update when `toggleTheme` or `theme` changes.
   *
   * @returns {void}
   */
  const handleToggleClick = useCallback((): void => {
    try {
      const previousTheme: 'dark' | 'light' = theme;

      // Execute theme toggle from context
      toggleTheme();

      // Infer next theme based on previous theme
      const newTheme: 'dark' | 'light' = previousTheme === 'dark' ? 'light' : 'dark';

      // Log the theme transition for debugging/analytics
      console.info(
        `[ThemeToggle] Theme toggled: "${previousTheme}" -> "${newTheme}" at ${new Date().toISOString()}`
      );
    } catch (error: unknown) {
      // Defensive error handling with type-safe message extraction
      const errorMessage: string =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('[ThemeToggle] Toggle failed:', errorMessage);

      // Optionally report to external error tracking service (e.g., Sentry)
      // if (typeof window !== 'undefined' && window.Sentry) {
      //   window.Sentry.captureException(error);
      // }
    }
  }, [toggleTheme, theme]);

  /**
   * Determines the next theme (the theme that will be active after toggle).
   */
  const nextTheme: 'dark' | 'light' = useMemo<'dark' | 'light'>(
    () => (theme === 'dark' ? 'light' : 'dark'),
    [theme]
  );

  /**
   * Accessible label for screen readers describing the toggle action.
   */
  const ariaLabel: string = useMemo<string>(
    () => `Switch to ${nextTheme} mode`,
    [nextTheme]
  );

  /**
   * Icon displayed inside the button depending on the current theme.
   * Uses Unicode characters for simplicity (moon for dark, sun for light).
   */
  const icon: string = useMemo<string>(
    () => (theme === 'dark' ? '\u{1F319}' : '\u2600\uFE0F'),
    [theme]
  );

  /**
   * Indicates whether the button is pressed (active theme = dark).
   */
  const isPressed: boolean = theme === 'dark';

  return (
    <button
      type="button"
      onClick={handleToggleClick}
      aria-label={ariaLabel}
      aria-pressed={isPressed}
      className="theme-toggle-button"
    >
      {icon}
    </button>
  );
};

export default ThemeToggleButton;