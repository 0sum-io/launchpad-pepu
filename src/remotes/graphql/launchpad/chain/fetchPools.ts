import {
  execute,
  PoolPriceAndVolumeDocument,
  PoolPriceAndVolumeQuery,
} from "../../../../../graphql/launchpad/chain";

export async function fetchPools() {
  const res = await execute(PoolPriceAndVolumeDocument, {});
  const data: PoolPriceAndVolumeQuery = res.data;
  return data.pools;
}

export type RawPool = PoolPriceAndVolumeQuery["pools"][0];
