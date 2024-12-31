import { BigNumber } from "@ethersproject/bignumber";
import {
  Currency,
  CurrencyAmount,
  Token,
  Trade as LegacyTrade,
  TradeType,
} from "@sushiswap/core-sdk";

export type TradeUnion = LegacyTrade<
  Currency,
  Currency,
  TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT
>;

export type MethodArg = string | number | BigNumber;
export type MethodArgs = Array<MethodArg | MethodArg[]>;

export type OptionalMethodInputs =
  | Array<MethodArg | MethodArg[] | undefined>
  | undefined;

export type TokenAddress = string;

export type TokenBalancesMap = Record<
  TokenAddress,
  CurrencyAmount<Token> | undefined
>;
