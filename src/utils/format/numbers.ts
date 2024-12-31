import { Percent } from "@sushiswap/core-sdk";
import JSBI from "jsbi";

export namespace PercentUtil {
  export function fromFloat(value: number) {
    const decimalLength = countDecimals(value);
    const denominator = 10 ** decimalLength;
    return new Percent(value * denominator, denominator);
  }

  export function toFloat(value: Percent) {
    //@ts-ignore
    return value.asFraction.toSignificant(JSBI.toNumber(value.denominator));
  }
}

export function countDecimals(value: number) {
  if (Math.floor(value.valueOf()) === value.valueOf()) return 0;
  return value.toString().split(".")[1].length || 0;
}
