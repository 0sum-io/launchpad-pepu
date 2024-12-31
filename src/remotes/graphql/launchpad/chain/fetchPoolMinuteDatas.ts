import {
  execute,
  PoolMinuteDatasDocument,
  PoolMinuteDatasQuery,
} from "../../../../../graphql/launchpad/chain";

export async function fetchPoolMinuteDatas(poolId: string) {
  const res = await execute(PoolMinuteDatasDocument, { poolId: poolId });
  const data: PoolMinuteDatasQuery = res.data;
  return data.poolMinuteDatas;
}
