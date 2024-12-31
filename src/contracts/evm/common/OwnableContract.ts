import { GenericEVMContract } from "./GenericEVMContract";

export class OwnableContract extends GenericEVMContract {
  async owner() {
    return await this.contract.owner();
  }
}
