import { BigNumber, ethers, utils } from "ethers";

import { PercentUtil } from "./numbers";
import { formatDecimals } from "./formatDecimals";
import { Percent } from "@sushiswap/core-sdk";

export namespace UnsignedNumber {
  export const toFloat = parseBigNumberToFloat;
  export const toInt = parseBigNumberToInt;

  export function from(value: number | Percent | string, unit?: number) {
    const numberValue =
      value instanceof Percent ? PercentUtil.toFloat(value) : String(value);
    if (!unit) {
      return BigNumber.from(numberValue);
    }
    return utils.parseUnits(numberValue, unit);
  }
  export const toUnit = (amount: any, unit = "ether") =>
    ethers.utils.parseUnits(formatDecimals(amount, 18).toString(), unit);
}

export function parseBigNumberToFloat(
  val: ethers.BigNumber,
  decimals: number = 18
) {
  const formatted = utils.formatUnits(val, decimals);
  const parsed = parseFloat(formatted);
  return parsed;
}

export function parseBigNumberToInt(
  val: ethers.BigNumber,
  decimals: number = 18
) {
  const formatted = utils.formatUnits(val, decimals);
  const parsed = parseInt(formatted);
  return parsed;
}

/**
 *
 * @param val number to be formatted
 * @param decimals number of decimal places
 * @returns number
 * @description trims the passed val to the passed decimals but doesn't round up, useful for max values of tokens
 */
export function parseToFixed(val: number, decimals: number) {
  if (val == 0) return 0;

  if (!val) {
    return;
  }

  const multiplier = Math.pow(10, decimals);
  const fixed = Math.floor(val * multiplier) / multiplier;
  return fixed;
}

export function parseSecondsToReadable(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return { days, hours, minutes };
}

export function parseEthersErrorMessage(error: any) {
  if (error?.data?.message) {
    const [, message] = error.data.message.split(
      "Error: VM Exception while processing transaction: reverted with reason string "
    );
    return message;
  } else if (error?.message) {
    return error.message;
  } else return "Encountered an error";
}
