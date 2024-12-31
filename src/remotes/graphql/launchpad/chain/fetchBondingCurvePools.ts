import {
  execute,
  GetAllPoolsDocument,
  GetAllPoolsQuery,
} from "../../../../../graphql/launchpad/chain";

export async function fetchBondingCurvePools() {
  const res = await execute(GetAllPoolsDocument, {});
  const data: GetAllPoolsQuery = res.data;
  return data.pools;
}
