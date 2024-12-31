import { ChainId, EVMChainId } from "models/ChainId";
import { defineChain } from "thirdweb";

if (!process.env.NEXT_PUBLIC_CHAIN_ID)
  throw Error("NEXT_PUBLIC_CHAIN_ID is not set");
if (!process.env.NEXT_PUBLIC_CHAIN_NAME)
  throw Error("NEXT_PUBLIC_CHAIN_NAME is not set");
if (!process.env.NEXT_PUBLIC_CHAIN_SYMBOL)
  throw Error("NEXT_PUBLIC_CHAIN_SYMBOL is not set");
if (!process.env.NEXT_PUBLIC_LOGO)
  throw Error("NEXT_PUBLIC_LOGO is not set");
if (!process.env.NEXT_PUBLIC_RPC_URL)
  throw Error("NEXT_PUBLIC_RPC_URL is not set");
if (!process.env.NEXT_PUBLIC_EXPLORER_URL)
  throw Error("NEXT_PUBLIC_EXPLORER_URL is not set");

export type Chain = EVMChain;

interface EVMChain {
  type: "evm";
  chainId: number;
  chainName: string;
  rpcUrls: string[];
  icon: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
}

type ChainById = Record<EVMChainId, EVMChain>;

export const chains: ChainById = {
  [Number(process.env.NEXT_PUBLIC_CHAIN_ID)]: {
    type: "evm",
    chainId: EVMChainId.CHAIN,
    chainName: process.env.NEXT_PUBLIC_CHAIN_NAME,
    icon: process.env.NEXT_PUBLIC_LOGO,
    rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL],
    nativeCurrency: {
      name: process.env.NEXT_PUBLIC_CHAIN_SYMBOL,
      symbol: process.env.NEXT_PUBLIC_CHAIN_SYMBOL,
      decimals: 18,
    },
    blockExplorerUrls: [process.env.NEXT_PUBLIC_EXPLORER_URL],
  },
};

export const getChain = (chainId: ChainId) => {
  return chains[chainId];
};

export const thirdwebChain = defineChain({
  id: EVMChainId.CHAIN,
  name: process.env.NEXT_PUBLIC_CHAIN_NAME,
  rpc: chains[EVMChainId.CHAIN].rpcUrls,
  testnet: true,
  nativeCurrency: {
    name: process.env.NEXT_PUBLIC_CHAIN_SYMBOL,
    symbol: process.env.NEXT_PUBLIC_CHAIN_SYMBOL,
    decimals: 18,
  },
  chain: process.env.NEXT_PUBLIC_CHAIN_NAME,
  shortName: process.env.NEXT_PUBLIC_CHAIN_NAME,
  chainId: EVMChainId.CHAIN,
  slug: process.env.NEXT_PUBLIC_CHAIN_NAME,
  slip44: 714,
  explorers: [
    {
      name: "explorer",
      url: process.env.NEXT_PUBLIC_EXPLORER_URL,
      standard: "EIP3091",
    },
  ],
  icon: {
    url: process.env.NEXT_PUBLIC_LOGO,
    width: 512,
    height: 512,
    format: "png",
  },
  infoURL: process.env.NEXT_PUBLIC_EXPLORER_URL,
});

export const thirdwebChains = {
  [EVMChainId.CHAIN]: thirdwebChain,
};

export const thirdwebRpcUrls = {
  [EVMChainId.CHAIN]: process.env.NEXT_PUBLIC_RPC_URL
};
