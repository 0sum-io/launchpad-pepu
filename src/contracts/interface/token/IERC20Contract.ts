import { BigNumberish, ethers } from "ethers";
import GenericContract from "../common/GenericContract";

export interface IERC20Contract extends GenericContract {
  totalSupply: () => Promise<number>;
  approve: (spender: string, amount: BigNumberish) => Promise<void>;
  allowance: (owner: string, spender: string) => Promise<number>;
  mint: (address: string, val: ethers.BigNumber) => Promise<void>;
  balanceOf: (address: string) => Promise<number>;
  decimals: () => Promise<number>;
  symbol: () => Promise<string>;
  name: () => Promise<string>;
}
