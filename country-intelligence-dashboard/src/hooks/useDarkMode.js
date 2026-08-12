import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useDarkMode() {
  const prefersDark = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  const [dark, setDark] = useLocalStorage("cid_dark_mode", !!prefersDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return [dark, setDark];
}
