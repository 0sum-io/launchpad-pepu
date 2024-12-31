import { BigNumberish } from "ethers";
import GenericContract from "../common/GenericContract";

export interface IUniswapV2RouterContract extends GenericContract {
  addLiquidity: (
    tokenA: string,
    tokenB: string,
    amountADesired: string,
    amountBDesired: string,
    amountAMin: string,
    amountBMin: string,
    to: string,
    deadline: number
  ) => Promise<any>;

  addLiquidityETH: (
    token: string,
    amountTokenDesired: string,
    amountTokenMin: string,
    amountETHMin: string,
    to: string,
    deadline: number,
    value: BigNumberish
  ) => Promise<any>;

  removeLiquidity: (
    tokenA: string,
    tokenB: string,
    liquidity: string,
    amountAMin: number,
    amountBMin: number,
    to: string,
    deadline: number
  ) => Promise<any>;

  removeLiquidityETH: (
    token: string,
    liquidity: string,
    amountTokenMin: number,
    amountETHMin: number,
    to: string,
    deadline: number
  ) => Promise<any>;

  swapExactTokensForTokens: (
    amountIn: number,
    amountOutMin: number,
    path: string[],
    to: string,
    deadline: number
  ) => Promise<any>;

  swapTokensForExactTokens: (
    amountOut: number,
    amountInMax: number,
    path: string[],
    to: string,
    deadline: number
  ) => Promise<any>;

  swapExactETHForTokens: (
    amountOutMin: number,
    path: string[],
    to: string,
    deadline: number
  ) => Promise<any>;

  swapTokensForExactETH: (
    amountOut: number,
    amountInMax: number,
    path: string[],
    to: string,
    deadline: number
  ) => Promise<any>;

  swapExactTokensForETH: (
    amountIn: number,
    amountOutMin: number,
    path: string[],
    to: string,
    deadline: number
  ) => Promise<any>;

  swapETHForExactTokens: (
    amountOut: number,
    path: string[],
    to: string,
    deadline: number
  ) => Promise<any>;

  getAmountsOut: (amountIn: number, path: string[]) => Promise<any>;

  getAmountsIn: (amountOut: number, path: string[]) => Promise<any>;
}
