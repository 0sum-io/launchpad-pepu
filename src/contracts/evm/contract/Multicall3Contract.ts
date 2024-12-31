import { GenericEVMContract } from "../common";
import MulticallABI from "abis/evm/multicall/multicall3.json";

export class Multicall3Contract extends GenericEVMContract {
  static ABI = MulticallABI;

  async getCurrentBlockTimestamp() {
    return await this.contract.getCurrentBlockTimestamp();
  }
}
