import { createThirdwebClient } from "thirdweb";
import { ConnectButton, darkTheme, ThirdwebProvider } from "thirdweb/react";

export const thirdwebClient = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

export const thirdwebAllowedWallets = [
  createWallet("io.metamask"),
  createWallet("net.gateweb3"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  walletConnect(),
];

import { thirdwebChain } from "constants/chains";
import { THIRDWEB_CLIENT_ID } from "constants/env";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { createWallet, walletConnect } from "thirdweb/wallets";

const Context = createContext({ open: () => {} });

export default function ThirdWebProvider({
  children,
}: {
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const open = useCallback(
    () => (ref.current?.children[0] as HTMLElement)?.click(),
    []
  );
  const value = useMemo(() => ({ open }), [open]);

  return (
    <Context.Provider value={value}>
      <ThirdwebProvider>
        <div ref={ref} style={{ display: "none" }}>
          <ConnectButton
            client={thirdwebClient}
            wallets={thirdwebAllowedWallets}
            connectModal={{
              showThirdwebBranding: false,
              size: "wide",
              title: "Connect Wallet",
              welcomeScreen: {
                title: `Your gateway to the decentralized world`,
                subtitle: `Connect a wallet to get started`,
              },
            }}
            theme={darkTheme({
              colors: {
                accentText: process.env.NEXT_PUBLIC_COLOR,
              },
            })}
            chains={[
              thirdwebChain,
            ]}
          />
        </div>
        {children}
      </ThirdwebProvider>
    </Context.Provider>
  );
}

export function useThirdWeb() {
  return useContext(Context).open;
}
