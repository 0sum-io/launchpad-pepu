import { useMounted } from "@boxfoxs/core-hooks";
import { ThemeProvider } from "@emotion/react";
import { useLocalStorage } from "hooks/useStorage";
import React, { useMemo } from "react";
import { ReactNode, useCallback, useEffect, useState } from "react";

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode] = useColorMode();
  const isMounted = useMounted();

  useEffect(() => {
    document.body.className = mode;
  }, [mode, isMounted]);
  const theme = useMemo(() => (isMounted ? { mode } : {}), [mode, isMounted]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export function useColorMode() {
  const isNativeDarkMode = useCheckDarkMode();
  const [mode, set] = useLocalStorage<"dark" | "light">("color-mode");
  const prevMode = mode ?? (isNativeDarkMode ? "dark" : "light");
  const toggle = useCallback(
    () => set(prevMode === "light" ? "dark" : "light"),
    [prevMode]
  );
  return [prevMode, toggle] as const;
}

export function useCheckDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(checkIsDarkMode());
  const isMounted = useMounted();
  useEffect(() => {
    if (!window) return;
    setIsDarkMode(checkIsDarkMode());
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event) => {
      setIsDarkMode(!!event.matches);
    };
    matchMedia.addEventListener("change", listener);
    return () => {
      matchMedia.removeEventListener("change", listener);
    };
  }, [isMounted]);
  return isDarkMode;
}

function checkIsDarkMode() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}
