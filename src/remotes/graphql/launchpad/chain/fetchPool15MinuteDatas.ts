import {
  execute,
  Pool15MinuteDatasDocument,
  Pool15MinuteDatasQuery,
} from "../../../../../graphql/launchpad/chain";

export async function fetchPool15MinuteDatas(poolId: string) {
  const res = await execute(Pool15MinuteDatasDocument, { poolId: poolId });
  const data: Pool15MinuteDatasQuery = res.data;
  return data.pool15MinuteDatas;
}
