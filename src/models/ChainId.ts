export type ChainId = EVMChainId;

if (!process.env.NEXT_PUBLIC_CHAIN_ID)
  throw Error("NEXT_PUBLIC_CHAIN_ID is not set");

export enum EVMChainId {
  CHAIN = Number(process.env.NEXT_PUBLIC_CHAIN_ID), // 12227332,
}

export function isEVMChainId(chainId: EVMChainId): chainId is EVMChainId {
  return Object.values(EVMChainId).includes(chainId as number);
}
