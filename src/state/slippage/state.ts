import { Percent } from "@sushiswap/core-sdk";
import { atom } from "recoil";

export const GLOBAL_DEFAULT_SLIPPAGE_PERCENT = new Percent(50, 10_000); // .5%
export const GLOBAL_DEFAULT_SLIPPAGE_STR =
  GLOBAL_DEFAULT_SLIPPAGE_PERCENT.toFixed(2);

export interface SlippageSliceState {
  input: string; // User set value in the text box
}

const initialState: SlippageSliceState = {
  input: GLOBAL_DEFAULT_SLIPPAGE_STR,
};

export const slippageState = atom({
  key: "slippage",
  default: initialState,
});
