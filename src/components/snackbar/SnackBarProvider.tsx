import { PortalConsumer } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { uuidV4 } from "web3-utils";
import { SnackBar, SnackBarType } from "./SnackBar";
import { convertNewlineToJSX } from "@boxfoxs/react-web";

type Snackbar = {
  id?: string;
  type: SnackBarType;
  children: ReactNode;
  duration?: number;
};
type SnackbarControl = {
  open: (state: Snackbar) => string;
  close: (id: string) => void;
};

export const SnackbarContext = createContext<SnackbarControl | null>(null);

export function SnackBarProvider({ children }: { children: ReactNode }) {
  const ref = useRef<SnackbarControl>();
  const control = useMemo<SnackbarControl>(
    () => ({
      open: (state) => ref.current.open(state),
      close: (id) => ref.current.close(id),
    }),
    []
  );

  return (
    <SnackbarContext.Provider value={control}>
      <SnackbarList ref={ref} />
      {typeof children === "string" ? convertNewlineToJSX(children) : children}
    </SnackbarContext.Provider>
  );
}

const SnackbarList = React.memo(
  React.forwardRef(function SnackbarList(
    {}: {},
    ref: React.ForwardedRef<SnackbarControl>
  ) {
    const refs = useRef<Record<string, { close: () => void }>>({});
    const [state, setState] = useState<Snackbar[]>([]);

    const open = useCallback((state: Snackbar) => {
      const id = state.id ?? uuidV4();
      setState((prev) => [...prev, { id, ...state }]);
      return id;
    }, []);

    const close = useCallback((id: string) => {
      refs.current[id]?.close();
      delete refs.current[id];
      setState((prev) => prev.filter((i) => i.id !== id));
    }, []);

    useImperativeHandle(ref, () => ({ open, close }), []);

    return (
      <PortalConsumer>
        <Container>
          {state.map((item) => (
            <SnackBar
              key={item.id}
              type={item.type}
              duration={item.duration}
              onClose={() => close(item.id)}
              ref={(control) => (refs.current[item.id] = control)}
            >
              {item.children}
            </SnackBar>
          ))}
        </Container>
      </PortalConsumer>
    );
  })
);

const Container = styled.div`
  position: fixed;
  top: 78px;
  right: 32px;
  z-index: 20;
`;
