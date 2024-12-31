import { EVMChainId } from "models/ChainId";

export const HOST = process.env.HOST;

export const SUPPORT_CHAINS = [
  EVMChainId.CHAIN,
];

export const DEFAULT_CHAIN_ID = EVMChainId.CHAIN;

export function isLive() {
  return !isAlpha();
}

export function isAlpha() {
  return false;
}

export const THIRDWEB_CLIENT_ID = "94a5977b5714e904cf072ff39175573c";
