import { Provider } from "@ethersproject/abstract-provider";
import { parseEther } from "@ethersproject/units";
import TOKEN_FACTORY_ABI from "abis/evm/contract/PresaleTokenFactory.json";
import { useAddresses, useContract } from "hooks/on-chain";
import { getEVMContract } from "utils/on-chain/evm";
import { GenericEVMContract } from "../common";

export class TokenFactoryContract extends GenericEVMContract {
  static ABI = TOKEN_FACTORY_ABI;

  async getTokenAddress(totalSupply: number) {
    return await this.contract
      .connect("0x766F8c20BF8A4941650Aa30E83b9DFb5234f05F2")
      .callStatic.create?.("Test", "Test", parseEther(String(totalSupply)));
  }
}

export function useTokenFactoryContract() {
  const addresses = useAddresses();
  return useContract(TokenFactoryContract, addresses.contract.TokenFactory);
}

export function getTokenFactoryContract(address: string, provider: Provider) {
  return getEVMContract({ contract: TokenFactoryContract, address, provider });
}
