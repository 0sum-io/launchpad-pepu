import { TickMath } from "@uniswap/v3-sdk";
import { BigNumber } from "bignumber.js";

export namespace LiquidityAmounts {
  // Constants
  const Q96 = new BigNumber(2).pow(96);

  // Function to calculate liquidity for a given amount of token0
  export function getLiquidityForAmount0(
    sqrtRatioAX96: BigNumber,
    sqrtRatioBX96: BigNumber,
    amount0: BigNumber
  ): BigNumber {
    if (sqrtRatioAX96.isGreaterThan(sqrtRatioBX96)) {
      [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }
    const intermediate = sqrtRatioAX96
      .multipliedBy(sqrtRatioBX96)
      .dividedBy(Q96);
    return amount0
      .multipliedBy(intermediate)
      .dividedBy(sqrtRatioBX96.minus(sqrtRatioAX96));
  }

  // Function to calculate liquidity for a given amount of token1
  export function getLiquidityForAmount1(
    sqrtRatioAX96: BigNumber,
    sqrtRatioBX96: BigNumber,
    amount1: BigNumber
  ): BigNumber {
    if (sqrtRatioAX96.isGreaterThan(sqrtRatioBX96)) {
      [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }
    return amount1
      .multipliedBy(Q96)
      .dividedBy(sqrtRatioBX96.minus(sqrtRatioAX96));
  }

  // Function to calculate liquidity for given amounts of token0 and token1
  export function getLiquidityForAmounts(
    sqrtRatioX96: BigNumber,
    sqrtRatioAX96: BigNumber,
    sqrtRatioBX96: BigNumber,
    amount0: BigNumber,
    amount1: BigNumber
  ): BigNumber {
    if (sqrtRatioAX96.isGreaterThan(sqrtRatioBX96)) {
      [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }

    if (sqrtRatioX96.isLessThanOrEqualTo(sqrtRatioAX96)) {
      return getLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
    } else if (sqrtRatioX96.isLessThan(sqrtRatioBX96)) {
      const liquidity0 = getLiquidityForAmount0(
        sqrtRatioX96,
        sqrtRatioBX96,
        amount0
      );
      const liquidity1 = getLiquidityForAmount1(
        sqrtRatioAX96,
        sqrtRatioX96,
        amount1
      );
      return BigNumber.min(liquidity0, liquidity1);
    } else {
      return getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
    }
  }
}

export function getLiquidity(
  sqrtPriceX96: BigNumber,
  tickLower: number,
  tickUpper: number,
  amount0Desired: BigNumber,
  amount1Desired: BigNumber
): BigNumber {
  const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
  const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);

  return LiquidityAmounts.getLiquidityForAmounts(
    sqrtPriceX96,
    new BigNumber(sqrtRatioAX96.toString()),
    new BigNumber(sqrtRatioBX96.toString()),
    amount0Desired,
    amount1Desired
  );
}
