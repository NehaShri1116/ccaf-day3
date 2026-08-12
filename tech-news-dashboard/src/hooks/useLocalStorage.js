import { useEffect, useState } from "react";

/**
 * Persists a piece of state to localStorage.
 * Loads on start, saves on every change, seeds with `initialValue`
 * when nothing is stored yet, and falls back safely if the stored
 * value is corrupt / unparsable JSON.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`Corrupt localStorage value for "${key}", using default.`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Could not persist "${key}" to localStorage.`, err);
    }
  }, [key, value]);

  return [value, setValue];
}
