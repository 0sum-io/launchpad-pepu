import { createObservableStorage, useStorage } from "@boxfoxs/core-hooks-dom";
import { safeLocalStorage, safeSessionStorage } from "@boxfoxs/next";

const sessionStorage$ = createObservableStorage(safeSessionStorage);

export function useSessionStorage<T extends string>(
  key: string,
  defaultValue?: T
) {
  return useStorage(sessionStorage$, key, defaultValue);
}

const localStorage$ = createObservableStorage(safeLocalStorage);

export function useLocalStorage<T extends string>(
  key: string,
  defaultValue?: T
) {
  return useStorage(localStorage$, key, defaultValue);
}
