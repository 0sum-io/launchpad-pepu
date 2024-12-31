import { Provider } from "@ethersproject/providers";
import { addresses } from "constants/addresses";
import { Multicall } from "ethereum-multicall";
import { useMemo } from "react";
import { useExactProvider } from "../useChain";

export function useMulticall(chainId: number | string) {
  const provider = useExactProvider(chainId);
  return useMemo(
    () =>
      new Multicall({
        multicallCustomContractAddress: addresses[chainId].contract.Multicall3,
        tryAggregate: false,
        ethersProvider: ("provider" in provider
          ? provider.provider
          : provider) as Provider,
      }),
    [provider, chainId]
  );
}
