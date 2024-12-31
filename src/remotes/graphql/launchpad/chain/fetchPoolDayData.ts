import {
  execute,
  PoolDayDatasDocument,
  PoolDayDatasQuery,
} from "../../../../../graphql/launchpad/chain";

export async function fetchPoolDayDatas(poolId: string) {
  const res = await execute(PoolDayDatasDocument, { poolId: poolId });
  const data: PoolDayDatasQuery = res.data;
  return data.poolDayDatas;
}
