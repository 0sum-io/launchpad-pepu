import { ReactNode, useCallback, useContext } from "react";
import { SnackbarContext } from "./SnackBarProvider";

export function useSnackbar() {
  const { open, close } = useContext(SnackbarContext);
  const warn = useCallback(
    (content: ReactNode, duration?: number) =>
      open({ type: "confirm", children: content, duration }),
    [open]
  );
  const success = useCallback(
    (content: ReactNode, duration?: number) =>
      open({ type: "success", children: content, duration }),
    [open]
  );
  const pending = useCallback(
    (content: ReactNode, duration?: number) =>
      open({ type: "pending", children: content, duration }),
    [open]
  );
  const fail = useCallback(
    (content: ReactNode, duration?: number) =>
      open({ type: "fail", children: content, duration }),
    [open]
  );
  return { warn, success, pending, fail, open, close };
}
