import { ethers, providers } from "ethers";

import PRESALE_MANAGER_ABI from "abis/evm/contract/PresaleManager.json";

import { useAddresses, useContract } from "hooks/on-chain";
import { GenericEVMContract } from "../common";
import { getEVMContract } from "utils/on-chain/evm";

export class PresaleManagerContract extends GenericEVMContract {
  static ABI = PRESALE_MANAGER_ABI;

  async getPresale(token: string) {
    return await this.contract.callStatic.presales(token);
  }

  async getProgress(tokenAddress: string) {
    const res = await this.contract.callStatic.getProgress(tokenAddress);
    return Number(res) / 1e6;
  }

  async isBondingCurveEnd(tokenAddress: string) {
    return await this.contract.isBondingCurveEnd(tokenAddress);
  }

  async presales(tokenAddress: string) {
    return await this.contract.presales(tokenAddress);
  }
}

export function getPresaleManagerContract(
  address: string,
  provider?: ethers.Signer | providers.Provider
) {
  return getEVMContract({
    contract: PresaleManagerContract,
    address,
    provider,
  });
}

export function usePresaleManagerContract() {
  const addresses = useAddresses();
  return useContract(PresaleManagerContract, addresses.contract.PresaleManager);
}
