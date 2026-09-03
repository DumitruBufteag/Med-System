import { useCallback, useState } from 'react';

/**
 * State that is mirrored into localStorage, so it survives a page reload.
 * Falls back to `initialValue` when storage is unavailable or holds bad JSON.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((previous: T) => T)) => {
      setStoredValue((previous) => {
        const next = value instanceof Function ? value(previous) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Storage can be full or disabled — keep the value in memory only.
        }
        return next;
      });
    },
    [key],
  );

  return [storedValue, setValue] as const;
}
