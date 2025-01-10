import { Currency, NativeCurrency, Token } from "@sushiswap/core-sdk";
import { EVMChainId } from "models/ChainId";

if (!process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY)
  throw Error("NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY is not set");
if (!process.env.NEXT_PUBLIC_CHAIN_SYMBOL)
  throw Error("NEXT_PUBLIC_CHAIN_SYMBOL is not set");

export const tokens = {
  WGAS10: {
    name: process.env.NEXT_PUBLIC_CHAIN_SYMBOL,
    symbol: process.env.NEXT_PUBLIC_CHAIN_SYMBOL,
    decimals: 18,
    icon: process.env.NEXT_PUBLIC_LOGO,
  },
};

export class ChainNativeCurrency extends NativeCurrency {
  protected constructor(
    chainId: number,
    name: string,
    symbol: string,
    decimals = 18
  ) {
    super(chainId, decimals, name, symbol);
  }

  public get wrapped(): Token {
    const wnative = WNATIVE[this.chainId];
    return wnative;
  }

  private static _cache: { [chainId: number]: ChainNativeCurrency } = {};

  public static onChain(
    chainId: number,
    name: string,
    symbol: string,
    decimals: number = 18
  ): ChainNativeCurrency {
    return (
      this._cache[chainId] ??
      (this._cache[chainId] = new ChainNativeCurrency(
        chainId,
        name,
        symbol,
        decimals
      ))
    );
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }
}

export const NATIVE = {
  [EVMChainId.CHAIN]: new Token(
    EVMChainId.CHAIN,
    process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY,
    18,
    process.env.NEXT_PUBLIC_CHAIN_SYMBOL,
    process.env.NEXT_PUBLIC_CHAIN_SYMBOL
  ),
};

export const WNATIVE = {
  [EVMChainId.CHAIN]: new Token(
    EVMChainId.CHAIN,
    process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY, // "0x1CE16390FD09040486221e912B87551E4e44Ab17",
    18,
    "W" + process.env.NEXT_PUBLIC_CHAIN_SYMBOL,
    "Wrapped" + process.env.NEXT_PUBLIC_CHAIN_SYMBOL
  ),
};

export const LISTED_TOKENS: Record<EVMChainId, Currency[]> = {
  [EVMChainId.CHAIN]: [],
};
