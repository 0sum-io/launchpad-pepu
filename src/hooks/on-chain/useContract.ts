import { useMemo } from "react";

import {
  GenericContract,
  IEVMContractConstructorWithABI,
} from "contracts/index";
import { checkIsSupportedChain } from "utils/on-chain";
import { getEVMContract } from "utils/on-chain/evm/getContract";
import { useChainId, useProviderForSign } from "./useChain";

export function useContract<T extends GenericContract>(
  contract: IEVMContractConstructorWithABI<T>,
  address: string,
  provider?: any
): T;
export function useContract<T extends GenericContract>(
  contract: IEVMContractConstructorWithABI<T>,
  address: undefined | null,
  provider?: any
): undefined | null;
export function useContract<T extends GenericContract>(
  contract: IEVMContractConstructorWithABI<T>,
  address: string | undefined | null,
  provider?: any
): T | null {
  const chainId = useChainId();
  const defaultProvider = useProviderForSign();

  return useMemo(() => {
    if (!address || (!checkIsSupportedChain(chainId) && !provider)) {
      return null;
    }
    const targetProvider = provider ?? defaultProvider;

    try {
      return getEVMContract<T>({
        contract: contract,
        address,
        provider: targetProvider,
      });
    } catch (error) {
      console.error(
        targetProvider
          ? "Failed to get contract with injected provider"
          : "Failed to get contract with default provider",
        error
      );
      return null;
    }
  }, [chainId, address, provider, defaultProvider, contract]);
}
