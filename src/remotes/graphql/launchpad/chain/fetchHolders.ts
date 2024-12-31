import {
  execute,
  HolderQueryDocument,
  HolderQueryQuery,
} from "../../../../../graphql/launchpad/chain";

export async function fetchHolders(token) {
  const res = await execute(HolderQueryDocument, { tokenId: token });
  const data: HolderQueryQuery = res.data;
  return data.accountBalances;
}
