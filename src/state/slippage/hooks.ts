import { Currency, Percent, Trade, TradeType } from "@sushiswap/core-sdk";
import { useCallback, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GLOBAL_DEFAULT_SLIPPAGE_PERCENT, slippageState } from "./state";

export enum SlippageError {
  TOO_LOW = "TOO_LOW",
  TOO_HIGH = "TOO_HIGH",
  INVALID_INPUT = "INVALID_INPUT",
}

const V2_SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000); // .50%
const ONE_TENTHS_PERCENT = new Percent(10, 10_000); // .10%

export default function useSwapSlippageTolerance(
  trade: Trade<Currency, Currency, TradeType> | undefined
): Percent {
  const defaultSlippageTolerance = useMemo(() => {
    if (!trade) return ONE_TENTHS_PERCENT;
    return V2_SWAP_DEFAULT_SLIPPAGE;
  }, [trade]);
  const percent = useSlippage(defaultSlippageTolerance);
  return percent;
}

const parseSlippageInput = (input: string): number =>
  Math.floor(Number.parseFloat(input) * 100);
const inputToPercent = (input: string) =>
  new Percent(parseSlippageInput(input), 10_000);

export function useSlippage(
  fallback: Percent = GLOBAL_DEFAULT_SLIPPAGE_PERCENT
) {
  const input = useSlippageInput();
  const error = useSlippageInputError();
  return error === SlippageError.INVALID_INPUT
    ? fallback
    : inputToPercent(input);
}

const useSlippageInput = () => useRecoilValue(slippageState).input;

const useSlippageInputError = (): SlippageError | false => {
  const slippage = useRecoilValue(slippageState);
  try {
    const parsedInput = parseSlippageInput(slippage.input);
    return !Number.isInteger(parsedInput) ||
      parsedInput < 1 ||
      /*!user.userExpertMode && */ parsedInput > 5000
      ? SlippageError.INVALID_INPUT
      : inputToPercent(slippage.input).lessThan(new Percent(5, 10_000))
      ? SlippageError.TOO_LOW
      : inputToPercent(slippage.input).greaterThan(new Percent(1, 100))
      ? SlippageError.TOO_HIGH
      : false;
  } catch (e) {
    return SlippageError.INVALID_INPUT;
  }
};

export function useUpdateSlippage() {
  const update = useSetRecoilState(slippageState);
  return useCallback((input: string) => {
    const parsedInput = parseFloat(input);
    if (isNaN(parsedInput)) return;
    update({ input: parsedInput.toFixed(2) });
  }, []);
}
