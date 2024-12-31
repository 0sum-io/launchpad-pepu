import { thirdwebClient } from "components/provider/ThirdWebProvider";
import { addresses } from "constants/addresses";
import { chains, thirdwebChains, thirdwebRpcUrls } from "constants/chains";
import { DEFAULT_CHAIN_ID } from "constants/env";
import { useSessionStorage } from "hooks/useStorage";
import { ChainId, EVMChainId, isEVMChainId } from "models/ChainId";
import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";
import { checkIsSupportedChain, getEVMProvider } from "utils/on-chain";

export function useChainId(): ChainId {
  const chainId = useWalletChainId();
  const [defaultChainId] = useDefaultChainId();
  return checkIsSupportedChain(chainId) ? chainId : defaultChainId;
}

export function useSupportChain() {
  const chainId = useWalletChainId();
  const chain = useChain();
  const switchChain = useSwitchChain();

  return {
    chainId: chain.chainId,
    walletChainId: chainId,
    isNotSupported: !checkIsSupportedChain(chainId),
    switch: useCallback(
      (chainId: EVMChainId = DEFAULT_CHAIN_ID) => switchChain(chainId),
      [switchChain]
    ),
  };
}

export function useChain() {
  const chainId = useChainId();
  return chains[chainId];
}

export function useDefaultChainId() {
  const [chainId, update] = useSessionStorage(
    "default-chain-id",
    String(DEFAULT_CHAIN_ID)
  );

  const put = useCallback(
    (chainId: ChainId) => update(String(chainId)),
    [update]
  );
  return [Number(chainId) as ChainId, put] as const;
}

export function useSwitchChain() {
  const wallet = useActiveWallet();
  const [, update] = useDefaultChainId();
  return useCallback(
    async (chainId: ChainId) => {
      update(chainId);
      if (isEVMChainId(chainId) && !!wallet) {
        wallet.switchChain(thirdwebChains[chainId]);
      }
    },
    [wallet]
  );
}

export function useAddresses(chainId?: ChainId) {
  const defaultChainId = useChainId();
  return addresses[chainId ?? defaultChainId];
}

export function useSigner() {
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const query = useQuery(
    ["signer", account?.address, chain?.id],
    async () => {
      return await ethers5Adapter.signer.toEthers({
        client: thirdwebClient,
        chain: { ...chain, rpc: thirdwebRpcUrls[chain.id] },
        account,
      });
    },
    { enabled: !!account }
  );
  return query.data;
}

export function useProvider(supportChainIds?: ChainId[]) {
  const chainId = useWalletChainId();
  const [defaultChainId] = useDefaultChainId();

  return useMemo(
    () =>
      getEVMProvider(
        chainId &&
          (checkIsSupportedChain(chainId) || supportChainIds?.includes(chainId))
          ? chainId
          : defaultChainId
      ),
    [chainId, defaultChainId, supportChainIds]
  );
}

export function useProviderForSign(supportChainIds?: ChainId[]) {
  const [defaultChainId] = useDefaultChainId();
  const signer = useSigner();
  const chainId = useWalletChainId();

  return useMemo(
    () =>
      !!signer &&
      (checkIsSupportedChain(chainId) || supportChainIds?.includes(chainId))
        ? signer
        : getEVMProvider(supportChainIds?.[0] ?? defaultChainId),
    [chainId, supportChainIds, signer, defaultChainId]
  );
}

export function useExactProvider(chainId: number | string) {
  const walletChainId = useWalletChainId();
  const signer = useSigner();

  return useMemo(() => {
    if (walletChainId === chainId && signer) {
      return signer;
    }
    return getEVMProvider(Number(chainId));
  }, [chainId, walletChainId, signer]);
}

export function useAddress() {
  const account = useActiveAccount();
  return account?.address;
}

export function useWalletChainId() {
  return useActiveWalletChain()?.id;
}
