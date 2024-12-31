import { Currency, Price, Token } from "@uniswap/sdk-core";
import {
  nearestUsableTick,
  TickMath,
  TICK_SPACINGS,
  FeeAmount,
  encodeSqrtRatioX96,
} from "@uniswap/v3-sdk";
import tryParseCurrencyAmount from "./lib";
import { tryParseTick } from "./utils";

export function calculateTick(
  currencyA: Currency,
  currencyB: Currency,
  baseCurrency: Currency,
  startPriceTypedValue: string,
  leftRangeTypedValue: string | boolean, // low price (token / baseToken : USDC / 1 ETH = 3000)
  rightRangeTypedValue: string | boolean, // high price (token / baseToken : USDC / 1 ETH = 3400)
  feeAmount?: FeeAmount
) {
  const tokenA = currencyA?.wrapped;
  const tokenB = currencyB?.wrapped;
  const baseToken = baseCurrency?.wrapped;
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA];
  // note to parse inputs in reverse
  const invertPrice = Boolean(baseToken && token0 && !baseToken.equals(token0));

  const price = calculatePrice(
    token0,
    token1,
    invertPrice,
    startPriceTypedValue
  );
  const ticks = calculateTicks(
    token0,
    token1,
    leftRangeTypedValue,
    rightRangeTypedValue,
    invertPrice,
    feeAmount
  );
  const sqrtRatioX96 = price
    ? encodeSqrtRatioX96(price.numerator, price.denominator)
    : undefined;

  return {
    sqrtRatioX96: sqrtRatioX96.toString(),
    tickLower: ticks.lower,
    tickUpper: ticks.upper,
  };
}

function calculatePrice(
  token0: Token,
  token1: Token,
  invertPrice: boolean,
  startPriceTypedValue: string
) {
  const parsedQuoteAmount = tryParseCurrencyAmount(
    startPriceTypedValue,
    invertPrice ? token0 : token1
  );
  if (!(parsedQuoteAmount && token0 && token1)) {
    return;
  }
  const baseAmount = tryParseCurrencyAmount("1", invertPrice ? token1 : token0);
  const price =
    baseAmount && parsedQuoteAmount
      ? new Price(
          baseAmount.currency,
          parsedQuoteAmount.currency,
          baseAmount.quotient,
          parsedQuoteAmount.quotient
        )
      : undefined;
  return (invertPrice ? price?.invert() : price) ?? undefined;
}

function calculateTicks(
  token0: Token,
  token1: Token,
  leftRangeTypedValue: string | boolean,
  rightRangeTypedValue: string | boolean,
  invertPrice?: boolean,
  feeAmount?: FeeAmount
) {
  const tickSpaceLimits = {
    lower: feeAmount
      ? nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount])
      : undefined,
    upper: feeAmount
      ? nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount])
      : undefined,
  };
  return {
    lower:
      (invertPrice && typeof rightRangeTypedValue === "boolean") ||
      (!invertPrice && typeof leftRangeTypedValue === "boolean")
        ? tickSpaceLimits.lower
        : invertPrice
        ? tryParseTick(
            token1,
            token0,
            feeAmount,
            rightRangeTypedValue.toString()
          )
        : tryParseTick(
            token0,
            token1,
            feeAmount,
            leftRangeTypedValue.toString()
          ),
    upper:
      (!invertPrice && typeof rightRangeTypedValue === "boolean") ||
      (invertPrice && typeof leftRangeTypedValue === "boolean")
        ? tickSpaceLimits.upper
        : invertPrice
        ? tryParseTick(
            token1,
            token0,
            feeAmount,
            leftRangeTypedValue.toString()
          )
        : tryParseTick(
            token0,
            token1,
            feeAmount,
            rightRangeTypedValue.toString()
          ),
  };
}
