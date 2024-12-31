import { ethers, providers } from "ethers";

import UNISWAP_V3_PRESALE_MAKER_ABI from "abis/evm/contract/UniswapV3PresaleMaker.json";

import { Interface } from "@ethersproject/abi";
import { parseEther } from "@ethersproject/units";
import { useAddresses, useContract } from "hooks/on-chain";
import { last } from "lodash";
import { getEVMContract } from "utils/on-chain/evm";
import { GenericEVMContract } from "../common";

export class UniswapV3PresaleMakerContract extends GenericEVMContract {
  static ABI = UNISWAP_V3_PRESALE_MAKER_ABI;

  async startWithNewToken(
    paymentToken: string,
    name: string,
    symbol: string,
    totalSupply: number,
    sqrtPriceX96: string,
    tickLower: number,
    tickUpper: number,
    amountToSale: number,
    amountToRaise: number,
    amountForBuyInstantly: number,
    toTreasuryRate: number,
    startTimestamp: number,
    deadline: number,
    data: string
  ) {
    const gasPrice = await this.contract.provider.getGasPrice(); // for non 1559 chains
    const tx = await this.contract.startWithNewToken(
      paymentToken,
      name,
      symbol,
      parseEther(String(totalSupply)),
      sqrtPriceX96,
      tickLower,
      tickUpper,
      parseEther(String(amountToSale)),
      parseEther(String(amountToRaise)),
      parseEther(String(amountForBuyInstantly)),
      toTreasuryRate,
      startTimestamp,
      deadline,
      data,
      {
        gasPrice,
      }
    );
    const res = await tx.wait();
    const abi = new Interface(this.abi);
    const rawLog = last(res.logs)! as ethers.providers.Log;
    const parsedLog = abi.parseLog(rawLog);
    return parsedLog.args[2];
  }

  async start(
    paymentToken: string,
    saleToken: string,
    sqrtPriceX96: string,
    tickLower: string,
    tickUpper: string,
    amountToSale: string,
    amountToRaise: string,
    amountForBuyInstantly: string,
    toTreasuryRate: string,
    distributor: string,
    data: string
  ) {
    const tx = await this.contract.start(
      paymentToken,
      saleToken,
      sqrtPriceX96,
      tickLower,
      tickUpper,
      amountToSale,
      amountToRaise,
      amountForBuyInstantly,
      toTreasuryRate,
      distributor,
      data
    );
    await tx.wait();
  }
}

export function getUniswapV3PresaleMakerContract(
  address: string,
  provider?: ethers.Signer | providers.Provider
) {
  return getEVMContract({
    contract: UniswapV3PresaleMakerContract,
    address,
    provider,
  });
}

export function useUniswapV3PresaleMakerContract() {
  const addresses = useAddresses();
  return useContract(
    UniswapV3PresaleMakerContract,
    addresses.contract.V3PresaleMaker
  );
}
