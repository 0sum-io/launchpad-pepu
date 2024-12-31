import BigNumber from "bignumber.js";
import { ethers } from "ethers";

BigNumber.config({ EXPONENTIAL_AT: 20 });

/**
 * Format a number to a specified precision without rounding
 * if the number is integer, nothing will be done
 * https://en.wikipedia.org/wiki/Significant_figures
 * @param balance - string ecimal to format
 * @param precision - number of significant figures
 * @returns formatted number
 */
export const formatDecimal = (
  balance: string | number,
  precision: number = 8
) => {
  // If the number is a decimal, return it with the specified precision
  const [integer, decimal] = String(balance).split(".");
  if (!decimal) return balance;
  if (precision === 0) return integer || "0";
  if (decimal.length <= precision) return balance;
  const res = integer + "." + decimal.slice(0, precision);
  const resB = new BigNumber(res);
  return resB.toString();
};

export const shortenDecimal = (
  balance: string,
  precision: number = 8
): string => {
  const balanceB = new BigNumber(balance);
  // Split the string into integer and decimal parts
  const [integerPart, decimalPart = ""] = balanceB.toString().split(".");

  // If the decimal part is shorter than or equal to 5 digits (4 + 1), return as is
  if (decimalPart.length <= precision) {
    return balanceB.toString();
  }

  // Take the first 4 digits and the last digit
  const firstFour = decimalPart.slice(0, precision - 1);
  const lastDigit = decimalPart[precision - 1];

  // Construct the shortened decimal
  return `${integerPart}.${firstFour}...${lastDigit}`;
};
/**
 * Round a number to a specified precision
 * @param balance - number to round
 * @param precision - number of decimal places
 * @returns rounded number
 */
export const roundToNDecimals = (balance: number, precision: number = 3) => {
  if (Number.isInteger(balance)) return balance;

  return balance.toFixed(precision);
};

export const roundNumber = (balance: number, precision: number = 3) => {
  return parseFloat(balance.toFixed(precision));
};

export function decimalToWei(
  decimalString: string,
  decimals = 18
): ethers.BigNumber {
  try {
    if (!isValidDecimal(decimalString)) {
      throw new Error("Invalid decimal string: " + decimalString);
    }
    return ethers.utils.parseUnits(decimalString, decimals);
  } catch (error) {
    const decimalStringFixed =
      decimalString.split(".")[0] ||
      "0" + "." + decimalString.split(".")[1]?.slice(0, decimals);
    return ethers.utils.parseUnits(decimalStringFixed, decimals);
  }
}

export function weiToDecimal(wei: ethers.BigNumber, decimals = 18): string {
  return ethers.utils.formatUnits(wei, decimals);
}

// Function to add two decimal strings
export function addDecimals(decimal1: string, decimal2: string, decimals = 18) {
  const decimal1B = new BigNumber(decimal1);
  const decimal2B = new BigNumber(decimal2);
  const res = decimal1B.plus(decimal2B).toString();
  // remove decimals after 18th
  const [integer, decimal] = res.split(".");
  if (!decimal) return res;
  if (decimal.length <= decimals) return res;
  return integer + "." + decimal.slice(0, decimals);
}

// Function to subtract two decimal strings
export function subtractDecimals(
  decimal1: string,
  decimal2: string,
  decimals = 18
) {
  const wei1 = new BigNumber(decimal1);
  const wei2 = new BigNumber(decimal2);
  const res = wei1.minus(wei2).toString();
  // remove decimals after 18th
  const [integer, decimal] = res.split(".");
  if (!decimal) return res;
  if (decimal.length <= decimals) return res;
  return integer + "." + decimal.slice(0, decimals);
}

// Function to multiply two decimal strings
export function multiplyDecimals(
  decimal1: string | number,
  decimal2: string | number,
  decimals = 18
): string {
  const decimal1B = new BigNumber(decimal1);
  const decimal2B = new BigNumber(decimal2);
  // Multiply the two decimals
  const res = decimal1B.times(decimal2B).toString();
  // remove decimals after 18th
  const [integer, decimal] = res.split(".");
  if (!decimal) return res;
  if (decimal.length <= decimals) return res;
  return integer + "." + decimal.slice(0, decimals);
}

export function divideDecimals(
  decimal1: string,
  decimal2: string,
  decimals = 18
): string {
  try {
    const decimal1B = new BigNumber(decimal1);
    const decimal2B = new BigNumber(decimal2);
    if (decimal2B.isZero()) {
      return "0";
    }
    const res = decimal1B.div(decimal2B).toString();
    // remove decimals after 18th
    const [integer, decimal] = res.split(".");
    if (!decimal) return res;
    if (decimal.length <= decimals) return res;
    return integer + "." + decimal.slice(0, decimals);
  } catch (error) {
    return "0";
  }
}

// Function to check if a decimal string is greater than another
export function isGreaterThan(decimal1: string, decimal2: string) {
  const decimal1B = new BigNumber(decimal1);
  const decimal2B = new BigNumber(decimal2);
  return decimal1B.gt(decimal2B);
}

// Function to check if a decimal string is greater than or equal to another
export function isGreaterThanOrEqual(decimal1: string, decimal2: string) {
  const decimal1B = new BigNumber(decimal1);
  const decimal2B = new BigNumber(decimal2);
  return decimal1B.gte(decimal2B);
}

export function isLessThan(decimal1: string, decimal2: string) {
  const decimal1B = new BigNumber(decimal1);
  const decimal2B = new BigNumber(decimal2);
  return decimal1B.lt(decimal2B);
}

// Function to check if a decimal string is less than or equal to another
export function isLessThanOrEqual(decimal1: string, decimal2: string) {
  const decimal1B = new BigNumber(decimal1);
  const decimal2B = new BigNumber(decimal2);
  return decimal1B.lte(decimal2B);
}

// Function to check if two decimal strings are equal
export function isEqual(decimal1: string, decimal2: string) {
  return new BigNumber(decimal1).eq(new BigNumber(decimal2));
}

// Function to floor a decimal string to the integer value
export function floorDecimals(decimalString: string, decimals = 18) {
  if (decimals === 0) {
    return decimalString.split(".")[0] || "0";
  }
  const wei = decimalToWei(decimalString, decimals);
  return wei.div(ethers.BigNumber.from(10).pow(decimals)).toString();
}

// Round a decimal string to the specified number of decimal places
export function roundDecimals(decimalString, decimalPlaces = 0, decimals = 18) {
  const decimalB = new BigNumber(decimalString);
  return parseFloat(decimalB.toFixed(decimalPlaces)).toString();
}

export function toFixed(value: string, decimals = 18) {
  // Check if there are more digits after the decimal point than the specified number of decimals
  const [integer, decimal] = value.split(".");
  if (!decimal || decimal.length <= decimals) {
    return value;
  }

  if (decimals === 0) {
    return integer || "0";
  }

  return integer + "." + decimal.slice(0, decimals);
}

function isValidDecimal(value: string) {
  return /^\d*\.?\d*$/.test(value);
}

export function formatMoney(amount: number) {
  // Check if the amount is a valid number
  if (isNaN(amount)) {
    return "Invalid amount";
  }

  // Define the thresholds for thousands and millions
  const thousandThreshold = 1000;
  const millionThreshold = 1000000;

  // Check if the amount is in millions
  if (Math.abs(amount) >= millionThreshold) {
    return `$${(amount / millionThreshold).toFixed(1)}m`;
  }

  // Check if the amount is in thousands
  if (Math.abs(amount) >= thousandThreshold) {
    return `$${(amount / thousandThreshold).toFixed(1)}k`;
  }

  // If the amount is less than a thousand, return it as is
  return "$" + amount.toFixed(2);
}
