import { ethers, providers } from "ethers";
import { getEVMContract } from "utils/on-chain/evm/getContract";
import { parseEther } from "@ethersproject/units";
import PRESALE_SWAP_ROUTER_ABI from "abis/evm/contract/PresaleSwapQuoter";
import { useAddresses, useProviderForSign } from "hooks/on-chain";
import { EVMChainId } from "models/ChainId";
import { useMemo } from "react";
import { GenericEVMContract } from "../common";
export class UniswapV3SwapQuoterContract extends GenericEVMContract {
  static ABI = PRESALE_SWAP_ROUTER_ABI.abi;
  async quoteExactInputSingle(
    tokenIn: string,
    tokenOut: string,
    amountIn: number,
    limitSqrtPrice: number
  ) {
    return await this.contract.callStatic.quoteExactInputSingle(
      tokenIn,
      tokenOut,
      100,
      parseEther(String(amountIn)),
      parseEther(String(limitSqrtPrice))
    );
  }
}
export function getQuoterContract(
  address: string,
  provider?: ethers.Signer | providers.Provider
) {
  return getEVMContract({
    contract: UniswapV3SwapQuoterContract,
    address,
    provider,
  });
}
export function useQuoterContract(
  chainId?: EVMChainId,
  provider?: ethers.Signer | providers.Provider
) {
  const addresses = useAddresses(chainId);
  const defaultProvider = useProviderForSign();
  const targetProvider = provider ?? defaultProvider;
  return useMemo(
    () => getQuoterContract(addresses.contract.Quoter, targetProvider),
    [addresses.contract.SwapRouter, targetProvider]
  );
}