import {
  execute,
  SwapHistoryDocument,
  SwapHistoryQuery,
} from "../../../../../graphql/launchpad/chain";

export async function fetchSwapHistory(poolId: string, page: number) {
  const res = await execute(SwapHistoryDocument, {
    poolId,
    skip: (page - 1) * 10,
  });
  const data: SwapHistoryQuery = res.data;
  return data.swaps;
}

export type SwapHistory = SwapHistoryQuery["swaps"][0];
