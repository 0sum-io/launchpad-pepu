import { Currency, CurrencyAmount, Token } from "@sushiswap/core-sdk";
import { ERC20Contract } from "contracts/index";
import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useMulticallRead } from "../multicall";

function bigNumToCurrencyAmount(totalSupply?: BigNumber, token?: Currency) {
  return token?.isToken && totalSupply
    ? CurrencyAmount.fromRawAmount(token, totalSupply.toString())
    : undefined;
}

export function useMultipleTotalSupply(tokens?: (Currency | undefined)[]) {
  const res = useMulticallRead(
    tokens?.map((t) => (t?.isToken ? t.address : undefined)) ?? [],
    ERC20Contract.ABI,
    "totalSupply"
  );

  return useMemo<Record<string, CurrencyAmount<Token>>>(
    () =>
      Object.fromEntries(
        res.data?.map((i) => [
          i.address,
          bigNumToCurrencyAmount(
            BigNumber.from(i.returns[0]),
            tokens.find((t) => t.wrapped.address === i.address)
          ),
        ]) ?? []
      ),
    [res.data, tokens]
  );
}

export function useTotalSupply(token?: Currency) {
  const res = useMultipleTotalSupply([token]);
  return token && res[token.wrapped.address];
}
