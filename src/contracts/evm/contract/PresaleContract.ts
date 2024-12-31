import { ethers, providers } from "ethers";

import PRESALE_ABI from "abis/evm/contract/Presale.json";

import { formatUnits } from "@ethersproject/units";
import { getEVMContract } from "utils/on-chain/evm";
import { GenericEVMContract } from "../common";
import { useContract } from "hooks/on-chain";

export class PresaleContract extends GenericEVMContract {
  static ABI = PRESALE_ABI;

  async isEnd() {
    return await this.contract.callStatic.isEnd();
  }

  async info() {
    const info = await this.contract.callStatic.info();
    return info;
  }

  async tokenInfo() {
    const info = await this.contract.callStatic.tokenInfo();
    return {
      address: info[0],
      symbol: info[1],
      name: info[2],
      totalSupply: info[3],
    };
  }

  async canDistribute(address: string) {
    return await this.contract.callStatic.canDistribute(address);
  }

  async distribute(address: string, deadline: number) {
    return await this.contract.distribute(address, deadline);
  }

  async getRaisedAmount() {
    const isEnd = await this.isEnd();
    if (isEnd) {
      const info = await this.info();
      return Number(formatUnits(info.amountToRaise, 18));
    }
    const res = await this.contract.callStatic.getRaisedAmount();
    return Number(formatUnits(res, 18));
  }
}

export function usePresaleContract(address?: string) {
  return useContract(PresaleContract, address);
}

export function getPresaleContract(
  address: string,
  provider?: ethers.Signer | providers.Provider
) {
  return getEVMContract({
    contract: PresaleContract,
    address,
    provider,
  });
}
