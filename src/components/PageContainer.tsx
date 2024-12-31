import { ReactNode } from "react";
import { Header } from "./header/Header";

interface Props {
  children: ReactNode;
}

export function PageContainer({ children }: Props) {
  return (
    <div
      style={{
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
        }}
      >
        <Header />
        {children}
      </div>
    </div>
  );
}
