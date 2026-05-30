tsx
import React from 'react';
import { render, screen, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../ThemeContext';

/**
 * Unit tests for ThemeContext verifying toggleTheme updates the theme correctly,
 * triggers re-renders in consuming components, persists the theme to localStorage,
 * and applies the corresponding data-theme attribute to the DOM.
 *
 * Also covers edge cases:
 * - Precedence of `initialTheme` over persisted localStorage value.
 * - Resilience when localStorage is unavailable.
 * - Invalid persisted values fall back to 'light'.
 *
 * @since 1.0.0
 * @group ThemeContext
 */
describe('ThemeContext', () => {
  // ---------------------------------------------------------------------------
  // Constants & Mocks
  // ---------------------------------------------------------------------------

  /** The localStorage key used to persist theme preference. */
  const STORAGE_KEY = 'theme';

  /** Mock storage object simulating localStorage contents. */
  let localStorageMock: Record<string, string | null> = {};

  // ---------------------------------------------------------------------------
  // Lifecycle Hooks
  // ---------------------------------------------------------------------------

  /**
   * Restore all mocked implementations after each test to guarantee a clean
   * environment for the next test. This does not interfere with tests that
   * manually restore mocks before re‑setting them.
   */
  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * Prepare a fresh mock localStorage before every test (enabled by default).
   */
  beforeEach(() => {
    setupLocalStorage(true);
  });

  // ---------------------------------------------------------------------------
  // Helper Functions
  // ---------------------------------------------------------------------------

  /**
   * Mocks the `localStorage` `Storage` prototype methods.
   *
   * When `enableLocalStorage` is `true`, the mock operates as a normal in‑memory
   * store. When `false`, all methods throw an `Error` to simulate a restricted
   * environment (e.g. private browsing in some browsers).
   *
   * @param enableLocalStorage - Whether to enable (true) or disable (throw) localStorage.
   */
  function setupLocalStorage(enableLocalStorage: boolean = true): void {
    const storagePrototype: Storage = Storage.prototype;

    if (!enableLocalStorage) {
      const throwFn = (): never => {
        throw new Error('localStorage is not available');
      };
      jest.spyOn(storagePrototype, 'getItem').mockImplementation(throwFn);
      jest.spyOn(storagePrototype, 'setItem').mockImplementation(throwFn);
      jest.spyOn(storagePrototype, 'removeItem').mockImplementation(throwFn);
      jest.spyOn(storagePrototype, 'clear').mockImplementation(throwFn);
    } else {
      localStorageMock = {};
      jest.spyOn(storagePrototype, 'getItem').mockImplementation(
        (key: string): string | null => localStorageMock[key] ?? null,
      );
      jest.spyOn(storagePrototype, 'setItem').mockImplementation(
        (key: string, value: string): void => {
          localStorageMock[key] = value;
        },
      );
      jest.spyOn(storagePrototype, 'removeItem').mockImplementation(
        (key: string): void => {
          delete localStorageMock[key];
        },
      );
      jest.spyOn(storagePrototype, 'clear').mockImplementation((): void => {
        localStorageMock = {};
      });
    }
  }

  /**
   * Creates a React wrapper component that includes the `ThemeProvider`.
   *
   * @param initialTheme - Optional initial theme to pass to the provider.
   * @returns A React functional component that wraps children with `ThemeProvider`.
   */
  const createWrapper = (
    initialTheme?: 'light' | 'dark',
  ): React.FC<{ children: React.ReactNode }> => {
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
    );
    // Provide a display name for easier debugging in test output
    Wrapper.displayName = `ThemeProviderWrapper(${initialTheme ?? 'unset'})`;
    return Wrapper;
  };

  // ---------------------------------------------------------------------------
  // Tests – Default Theme & Initialisation
  // ---------------------------------------------------------------------------

  /**
   * Verifies that the default theme is 'light' when neither an initial theme
   * prop nor a persisted value exists in localStorage.
   */
  it('should provide light theme by default when no stored theme exists', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');
    // No write should occur on initial mount because the default is used
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  /**
   * Verifies that the theme is correctly restored from localStorage on mount.
   */
  it('should restore theme from localStorage when provided', () => {
    localStorageMock[STORAGE_KEY] = 'dark';
    const wrapper = createWrapper(); // no initialTheme → reads from storage
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('dark');
  });

  /**
   * Verifies that the `initialTheme` prop takes precedence over a saved value
   * in localStorage when both are provided.
   */
  it('should prefer initialTheme over localStorage when both are provided', () => {
    localStorageMock[STORAGE_KEY] = 'dark';
    const wrapper = createWrapper('light'); // prop overrides storage
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');
    // localStorage should NOT be overwritten during initialisation
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  /**
   * Verifies that invalid values in localStorage fall back to the default 'light' theme.
   */
  it('should fall back to light theme when stored value is invalid', () => {
    localStorageMock[STORAGE_KEY] = 'blue';
    const wrapper = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');
  });

  // ---------------------------------------------------------------------------
  // Tests – Toggle Behaviour
  // ---------------------------------------------------------------------------

  /**
   * Verifies that calling `toggleTheme` changes the theme from 'light' to 'dark'
   * and persists the change.
   */
  it('should toggle theme from light to dark', () => {
    const wrapper = createWrapper('light');
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'dark');
  });

  /**
   * Verifies that calling `toggleTheme` changes the theme from 'dark' to 'light'.
   */
  it('should toggle theme from dark to light', () => {
    const wrapper = createWrapper('dark');
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'light');
  });

  /**
   * Verifies that the toggle still works without throwing when `localStorage`
   * is unavailable. The theme should switch internally but not attempt to persist.
   */
  it('should handle localStorage being unavailable gracefully', () => {
    // Re‑mock localStorage to throw on any access (overrides beforeEach mocks)
    setupLocalStorage(false);

    const wrapper = createWrapper('light');
    const { result } = renderHook(() => useTheme(), { wrapper });

    // Default theme should still be light
    expect(result.current.theme).toBe('light');

    // Toggle should succeed without throwing
    expect(() => {
      act(() => {
        result.current.toggleTheme();
      });
    }).not.toThrow();

    // Theme should have changed despite localStorage being broken
    expect(result.current.theme).toBe('dark');
  });

  // ---------------------------------------------------------------------------
  // Tests – DOM Attribute Verification (Regression for the original bug)
  // ---------------------------------------------------------------------------

  /**
   * Verifies that after toggling the theme, the `data-theme` attribute on the
   * document root is updated accordingly. This directly tests the UI update
   * that was broken in the original bug report (#1052).
   *
   * The `ThemeProvider` is assumed to set `data-theme` on `document.documentElement`
   * to reflect the current theme.
   */
  it('should update data-theme attribute on document root when toggleTheme is called', () => {
    // Ensure the attribute starts clean
    document.documentElement.removeAttribute('data-theme');

    const wrapper = createWrapper('light');
    const { result } = renderHook(() => useTheme(), { wrapper });

    // After mount the attribute should be 'light'
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    // Toggle to dark
    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // Toggle back to light
    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  // ---------------------------------------------------------------------------
  // Tests – Consumer Re‑rendering
  // ---------------------------------------------------------------------------

  /**
   * Verifies that a component consuming `useTheme` re‑renders with the updated
   * theme when `toggleTheme` is called via a button click. Uses a render‑count
   * tracker that is tolerant to React StrictMode double‑invocation.
   */
  it('should re-render consumers when toggleTheme is called from context', async () => {
    const renderCount = jest.fn();

    /** A simple consumer component displaying the current theme and a toggle button. */
    function Consumer(): JSX.Element {
      const { theme, toggleTheme } = useTheme();
      renderCount();
      return (
        <div>
          <span data-testid="theme">{theme}</span>
          <button data-testid="toggle" onClick={toggleTheme}>
            Toggle
          </button>
        </div>
      );
    }

    const user = userEvent.setup();
    render(
      <ThemeProvider initialTheme="light">
        <Consumer />
      </ThemeProvider>,
    );

    // Initial render: theme 'light' and at least one render call
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(renderCount.mock.calls.length).toBeGreaterThanOrEqual(1);
    const initialCalls = renderCount.mock.calls.length;

    // First toggle: should change to dark
    await user.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    // Render count should have increased by at least 1 (tolerant to StrictMode)
    expect(renderCount.mock.calls.length).toBeGreaterThanOrEqual(initialCalls + 1);
    const afterFirstToggle = renderCount.mock.calls.length;

    // Second toggle: should revert to light
    await user.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(renderCount.mock.calls.length).toBeGreaterThanOrEqual(afterFirstToggle + 1);
  });
});