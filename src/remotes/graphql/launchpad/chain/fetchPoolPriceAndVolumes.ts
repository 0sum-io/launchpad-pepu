import {
  execute,
  PoolPriceAndVolumeDocument,
  PoolPriceAndVolumeQuery,
} from "../../../../../graphql/launchpad/chain";

export async function fetchPoolPriceAndVolumes() {
  const res = await execute(PoolPriceAndVolumeDocument, {});
  const data: PoolPriceAndVolumeQuery = res.data;
  return data.pools;
}

export type PoolPriceAndVolume = PoolPriceAndVolumeQuery["pools"][0];
