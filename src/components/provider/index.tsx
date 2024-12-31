import { ReactNode } from "react";
import ThirdWebProvider from "./ThirdWebProvider";

export * from "./Web3ReactRoot";

export function RootProvider({ children }: { children: ReactNode }) {
  return <ThirdWebProvider>{children}</ThirdWebProvider>;
}
