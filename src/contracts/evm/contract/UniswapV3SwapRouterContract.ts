import { ethers, providers } from "ethers";

import SwapRouterABI from "abis/evm/contract/UniswapV3SwapRouter.json";
import { getEVMContract } from "utils/on-chain/evm/getContract";

import { parseEther } from "@ethersproject/units";
import { useAddresses, useProviderForSign } from "hooks/on-chain";
import { EVMChainId } from "models/ChainId";
import { useMemo } from "react";
import { GenericEVMContract } from "../common";

export class UniswapV3SwapRouterContract extends GenericEVMContract {
  static ABI = SwapRouterABI;

  async getPrice(
    tokenIn: string,
    tokenOut: string,
    recipient: string,
    deadline: number,
    amountIn: number,
    amountOutMinimum: number,
    limitSqrtPrice: number
  ) {
    const tx = await this.contract.callStatic.exactInputSingle(
      {
        tokenIn,
        tokenOut,
        recipient,
        deadline,
        amountIn: parseEther(String(amountIn)),
        amountOutMinimum,
        limitSqrtPrice,
      },
      {
        value: parseEther(String(amountIn)),
      }
    );
    return Number(tx);
  }

  async exactInputSingleETH(
    tokenIn: string,
    tokenOut: string,
    recipient: string,
    deadline: number,
    amountIn: number,
    amountNativeIn: number,
    amountOutMinimum: number,
    limitSqrtPrice: number
  ) {
    const gasPrice = await this.contract.provider.getGasPrice(); // for non 1559 chains
    return await this.contract.exactInputSingle(
      {
        tokenIn,
        tokenOut,
        recipient,
        deadline,
        fee: 100,
        amountIn: parseEther(String(amountIn)),
        amountOutMinimum,
        sqrtPriceLimitX96: parseEther(String(limitSqrtPrice)),
      },
      { value: parseEther(String(amountNativeIn)), gasPrice }
    );
  }

  async quoteExactInputSingleETH(
    tokenIn: string,
    tokenOut: string,
    recipient: string,
    deadline: number,
    amountIn: number,
    amountOutMinimum: number,
    limitSqrtPrice: number
  ) {
    return await this.contract.callStatic.exactInputSingle(
      {
        tokenIn,
        tokenOut,
        recipient,
        deadline,
        fee: 100,
        amountIn: parseEther(String(amountIn)),
        amountOutMinimum,
        sqrtPriceLimitX96: parseEther(String(limitSqrtPrice)),
      },
      { value: parseEther(String(amountIn)) }
    );
  }

  async quoteExactInputSingle(
    tokenIn: string,
    tokenOut: string,
    recipient: string,
    deadline: number,
    amountIn: number,
    amountOutMinimum: number,
    limitSqrtPrice: number
  ) {
    return await this.contract.callStatic.exactInputSingle({
      tokenIn,
      tokenOut,
      recipient,
      deadline,
      fee: 100,
      amountIn: parseEther(String(amountIn)),
      amountOutMinimum,
      sqrtPriceLimitX96: parseEther(String(limitSqrtPrice)),
    });
  }

  async exactInputSingle(
    tokenIn: string,
    tokenOut: string,
    recipient: string,
    deadline: number,
    amountIn: number,
    amountOutMinimum: number,
    limitSqrtPrice: number
  ) {
    return await this.contract.exactInputSingle({
      tokenIn,
      tokenOut,
      recipient,
      deadline,
      fee: 100,
      amountIn: parseEther(String(amountIn)),
      amountOutMinimum,
      sqrtPriceLimitX96: parseEther(String(limitSqrtPrice)),
    });
  }

  async exactInputSingleWithUnwrap(
    tokenIn: string,
    tokenOut: string,
    recipient: string,
    deadline: number,
    amountIn: number,
    amountOutMinimum: number,
    limitSqrtPrice: number
  ) {
    const gasPrice = await this.contract.provider.getGasPrice(); // for non 1559 chains
    const swapCall = this.contract.interface.encodeFunctionData(
      "exactInputSingle",
      [
        {
          tokenIn,
          tokenOut,
          recipient: this.contract.address,
          deadline,
          fee: 100,
          amountIn: parseEther(String(amountIn)),
          amountOutMinimum,
          sqrtPriceLimitX96: parseEther(String(limitSqrtPrice)),
        },
      ]
    );
    const unwrapCall = this.contract.interface.encodeFunctionData(
      "unwrapWETH9",
      [amountOutMinimum, recipient]
    );
    return await this.contract.multicall([swapCall, unwrapCall], {gasPrice});
  }

  async exactOutputSingle(
    tokenIn: string,
    tokenOut: string,
    recipient: string,
    deadline: number,
    amountOut: number,
    amountOutMinimum: number,
    limitSqrtPrice: number
  ) {
    const tx = await this.contract.exactOutputSingle({
      tokenIn,
      tokenOut,
      recipient,
      deadline,
      amountOut: parseEther(String(amountOut)),
      amountOutMinimum,
      limitSqrtPrice: parseEther(String(limitSqrtPrice)),
    });
    await tx.wait();
  }
}

export function getSwapRouterContract(
  address: string,
  provider?: ethers.Signer | providers.Provider
) {
  return getEVMContract({
    contract: UniswapV3SwapRouterContract,
    address,
    provider,
  });
}

export function useSwapRouterContract(
  chainId?: EVMChainId,
  provider?: ethers.Signer | providers.Provider
) {
  const addresses = useAddresses(chainId);
  const defaultProvider = useProviderForSign();
  const targetProvider = provider ?? defaultProvider;
  return useMemo(
    () => getSwapRouterContract(addresses.contract.SwapRouter, targetProvider),
    [addresses.contract.SwapRouter, targetProvider]
  );
}
