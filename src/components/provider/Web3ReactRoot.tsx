import { BlockNumberProvider } from "hooks/on-chain";
import React, { ReactNode } from "react";

export const RootStateProvider = React.memo(function RootStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <BlockNumberProvider>{children}</BlockNumberProvider>;
});
