import { EVMChainId } from "models/ChainId";
import { CHAIN } from "./CHAIN";

export const addresses: Record<
  EVMChainId,
  {
    contract: Record<string, string>;
    token?: Record<string, string>;
    initCodeHash?: string;
  }
> = {
  [EVMChainId.CHAIN]: CHAIN,
} as const;
