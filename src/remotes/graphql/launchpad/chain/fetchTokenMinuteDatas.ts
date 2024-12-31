import {
  execute,
  TokenMinuteDatasDocument,
  TokenMinuteDatasQuery,
} from "../../../../../graphql/launchpad/chain";

export async function fetchTokenMinuteDatas(token: string) {
  const res = await execute(TokenMinuteDatasDocument, { tokenId: token });
  const data: TokenMinuteDatasQuery = res.data;
  return data.tokenMinuteDatas;
}
