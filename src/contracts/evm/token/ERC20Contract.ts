import { BigNumberish, ethers, providers } from "ethers";

import ERC20ABI from "abis/evm/token/IERC20.json";
import { UnsignedNumber } from "utils/format";
import { getEVMContract } from "utils/on-chain/evm/getContract";

import { IERC20Contract } from "../../interface/token/IERC20Contract";
import { GenericEVMContract } from "../common/GenericEVMContract";

import { MaxUint256 } from "@ethersproject/constants";
import { useContract } from "hooks/on-chain";

export class ERC20Contract
  extends GenericEVMContract
  implements IERC20Contract
{
  static ABI = ERC20ABI;
  static DEFAULT_DECIMAL = 18;

  async symbol() {
    const res = await this.contract.symbol();
    return res;
  }

  async name() {
    const res = await this.contract.name();
    return res;
  }

  async decimals() {
    const res = await this.contract.decimals();
    return parseInt(res);
  }

  async approve(spender: string, amount: BigNumberish = MaxUint256) {
    const gasPrice = await this.contract.provider.getGasPrice(); // for non 1559 chains
    return await this.contract.approve(spender, amount, {gasPrice});
  }

  async signApprove(spender: string, amount: BigNumberish = MaxUint256) {
    console.log({
      to: this.contract.address,
      value: 0,
      data: this.contract.interface.encodeFunctionData("approve", [
        spender,
        amount,
      ]),
    });
    try {
      return await this.contract.signer.signTransaction({
        to: this.contract.address,
        value: 0,
        data: this.contract.interface.encodeFunctionData("approve", [
          spender,
          amount,
        ]),
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async allowance(owner: string, spender: string) {
    const allowance = await this.contract.allowance(owner, spender);
    const decimals = await this.decimals();
    return UnsignedNumber.toFloat(allowance, decimals);
  }

  async mint(address: string, val: ethers.BigNumber) {
    const payout = await this.contract.mint(address, val);
    await payout.wait();
  }

  async balanceOf(address: string) {
    return await this.contract.balanceOf(address);
  }

  async totalSupply() {
    const totalSupply = await this.contract.totalSupply();
    return totalSupply;
  }
}

export function getERC20Contract(
  address: string,
  provider?: ethers.Signer | providers.Provider
) {
  return getEVMContract({ contract: ERC20Contract, address, provider });
}

export function useERC20Contract(address?: string) {
  return useContract(ERC20Contract, address);
}
