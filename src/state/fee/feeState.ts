import { BigNumber } from "@ethersproject/bignumber";
import { atom } from "recoil";

export interface FeeState {
  maxFee: BigNumber | undefined | string;
  maxPriorityFeePerGas: BigNumber | undefined;
}

export const feeState = atom<FeeState>({
  key: "fee",
  default: {
    maxFee: undefined,
    maxPriorityFeePerGas: undefined,
  },
});
