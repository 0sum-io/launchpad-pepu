import { first } from "lodash";
import {
  execute,
  LastSwapDocument,
  LastSwapQuery,
} from "../../../../../graphql/launchpad/chain";

export async function fetchLastSwap() {
  const res = await execute(LastSwapDocument, {});
  const data: LastSwapQuery = res.data;
  return first(data.swaps);
}
