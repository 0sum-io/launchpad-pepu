import { orderBy } from "lodash";
import { EVMChainId } from "models/ChainId";
import {
  execute,
  GetAllPresalesDocument,
  GetAllPresalesQuery,
  Presale,
} from "../../../../../graphql/launchpad/chain";

export async function fetchPresales() {
  const res = await execute(GetAllPresalesDocument, {});
  const data: GetAllPresalesQuery = res.data;
  return orderBy(
    data?.presales.map(parsePresale).filter((i) => !!i),
    (i) => i.blockNumber,
    "desc"
  );
}

function parsePresale(data: Presale): ParsedPresale {
  try {
    return {
      chainId: EVMChainId.CHAIN,
      ...data,
      data: JSON.parse(data.data),
    };
  } catch {
    return null;
  }
}

export interface ParsedPresale extends Omit<Presale, "data"> {
  chainId: EVMChainId;
  data: {
    websiteUrl?: string;
    xUrl?: string;
    discordUrl?: string;
    telegramUrl?: string;
    description?: string;
    iconUrl?: string;
    thumbnailUrl?: string;
  };
}
