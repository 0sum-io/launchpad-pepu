import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { isAddress } from "ethers/lib/utils";

import { GenericContract, IEVMContractConstructors } from "contracts/index";
import { getEVMProvider } from "./getEVMProvider";

type EVMPayload<T extends GenericContract> = {
  contract: IEVMContractConstructors<T>;
  ABI?: ethers.ContractInterface;
  address: string;
  provider?: ethers.providers.Provider | ethers.Signer;
};

/**
 *
 * @param Contract implementation details of a contract
 * @param address contract address
 * @param ABI contract abi
 * @param provider provider to use contract with
 * @param account optional account that makes contract use signer instead of just provider if present
 * @returns
 */
export function getEVMContract<T extends GenericContract>({
  contract: Contract,
  address,
  provider = getEVMProvider(),
  ABI,
}: EVMPayload<T>): T {
  const targetAbi = "ABI" in Contract ? Contract.ABI : ABI;

  if (!targetAbi) {
    throw Error("invalid ABI");
  }

  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  if (provider instanceof Web3Provider) {
    return new Contract(address, targetAbi, provider.getSigner());
  } else {
    return new Contract(address, targetAbi, provider!);
  }
}
