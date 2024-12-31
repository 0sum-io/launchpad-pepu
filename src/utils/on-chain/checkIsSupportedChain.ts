import { getChain } from "constants/chains";
import { SUPPORT_CHAINS } from "constants/env";
import { ChainId, EVMChainId } from "models/ChainId";

export function checkIsSupportedChain(id?: number | string): id is ChainId {
  return SUPPORT_CHAINS.some((i) => i === id);
}

export function checkIsEvmChain(id: ChainId): id is EVMChainId {
  const chain = getChain(id);
  return chain.type === "evm";
}
