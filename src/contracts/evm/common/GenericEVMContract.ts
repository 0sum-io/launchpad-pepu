import { Fragment, Interface, JsonFragment } from "@ethersproject/abi";
import { Contract, ethers } from "ethers";
import { GenericContract } from "../../interface/common/GenericContract";

export abstract class GenericEVMContract implements GenericContract {
  address: string;
  abi: Array<Fragment | JsonFragment | string>;
  contract: Contract;
  provider: ethers.providers.Provider | ethers.Signer;

  public constructor(
    address: string,
    abi: Array<Fragment | JsonFragment | string>,
    provider: ethers.providers.Provider | ethers.Signer
  ) {
    this.address = address;
    this.abi = abi;
    this.provider = provider;
    this.contract = new ethers.Contract(address, abi, this.provider);
  }

  get interface() {
    return new Interface(this.abi);
  }

  get estimateGas() {
    return this.contract.estimateGas;
  }
}
