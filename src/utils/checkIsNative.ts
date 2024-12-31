import { Currency } from "@sushiswap/core-sdk";
import { NATIVE, tokens, WNATIVE } from "constants/tokens";

export function checkIsNative(chainId: number, target: string | Currency) {
  const wrappedAddress = WNATIVE[chainId]?.address;
  if (!wrappedAddress) {
    return false;
  }

  return typeof target === "string"
    ? wrappedAddress.toLowerCase() === target.toLowerCase()
    : target.isNative || target.wrapped?.address === wrappedAddress;
}

export function getNativeCurrency(chainId: number): Currency {
  return NATIVE[chainId];
}

export function getClearedName(target?: string | Currency) {
  if (!target) {
    return;
  }
  if (typeof target === "string") {
    return tokens[target]?.name || target;
  }

  if (checkIsNative(target.chainId, target)) {
    return NATIVE[target.chainId].name;
  }

  return target.name;
}

export function getClearedSymbol(target?: string | Currency) {
  if (!target) {
    return;
  }
  if (typeof target === "string") {
    return tokens[target]?.symbol || target;
  }

  if (checkIsNative(target.chainId, target)) {
    return NATIVE[target.chainId].symbol;
  }

  return target.symbol;
}

export function getTokenIcon(target?: string | Currency) {
  if (!target) {
    return;
  }
  if (typeof target === "string") {
    return getTokenIconBySymbol(target);
  }
  return getTokenIconBySymbol(target.symbol);
}

export function getTokenIconBySymbol(symbol?: string) {
  if (!symbol) {
    return;
  }
  if (tokens[symbol]) {
    return tokens[symbol].icon;
  }
  return process.env.NEXT_PUBLIC_LOGO;
}
