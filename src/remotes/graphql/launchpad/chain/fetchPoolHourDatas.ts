import {
  execute,
  PoolHourDatasDocument,
  PoolHourDatasQuery,
} from "../../../../../graphql/launchpad/chain";

export async function fetchPoolHourDatas(poolId: string) {
  const res = await execute(PoolHourDatasDocument, { poolId: poolId });
  const data: PoolHourDatasQuery = res.data;
  return data.poolHourDatas;
}
