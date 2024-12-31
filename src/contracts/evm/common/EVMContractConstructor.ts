import type { ethers } from "ethers";

import GenericContract from "../../interface/common/GenericContract";

export type IEVMContractConstructors<T extends GenericContract> =
  | IEVMContractConstructor<T>
  | IEVMContractConstructorWithABI<T>;

export interface IEVMContractConstructor<T extends GenericContract> {
  new (
    address: string,
    abi: ethers.ContractInterface,
    provider: ethers.providers.Provider | ethers.Signer
  ): T;
}

export interface IEVMContractConstructorWithABI<T extends GenericContract>
  extends IEVMContractConstructor<T> {
  ABI: ethers.ContractInterface;
}
