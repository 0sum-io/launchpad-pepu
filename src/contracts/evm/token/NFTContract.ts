import { ethers, providers } from "ethers";

import NFT_ABI from "abis/evm/token/NFT.json";
import { getEVMContract } from "utils/on-chain/evm/getContract";

import { GenericEVMContract } from "../common/GenericEVMContract";

import { useContract } from "hooks/on-chain";

export class NFTContract extends GenericEVMContract {
  static ABI = NFT_ABI;
  static DEFAULT_DECIMAL = 18;

  async symbol() {
    const res = await this.contract.symbol();
    return res;
  }

  async name() {
    const res = await this.contract.name();
    return res;
  }

  async balanceOf(address: string, tokenId: number) {
    const res = await this.contract.balanceOf(address, tokenId);
    return parseInt(res);
  }

  async uri() {
    return await this.contract.uri();
  }
}

export function getNFTContract(
  address: string,
  provider?: ethers.Signer | providers.Provider
) {
  return getEVMContract({ contract: NFTContract, address, provider });
}

export function useNFTContract(address?: string, provider?: any) {
  return useContract(NFTContract, address, provider);
}
