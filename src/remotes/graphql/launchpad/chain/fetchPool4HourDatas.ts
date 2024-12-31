import {
  execute,
  Pool4HourDatasDocument,
  Pool4HourDatasQuery,
} from "../../../../../graphql/launchpad/chain";

export async function fetchPool4hourDatas(poolId: string) {
  const res = await execute(Pool4HourDatasDocument, { poolId: poolId });
  const data: Pool4HourDatasQuery = res.data;
  return data.pool4HourDatas;
}
