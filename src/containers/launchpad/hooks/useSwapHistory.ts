import { useQuery } from "react-query";
import { LaunchpadQueries } from "remotes/graphql";
import {
  ParsedPresale,
  SwapHistory,
} from "remotes/graphql/launchpad/chain";

export function useSwapHistory(presale: ParsedPresale, page: number) {
  const query = useQuery<SwapHistory[]>(
    ["swap-history", presale, page],
    async () => {
      return await LaunchpadQueries[presale.chainId].fetchSwapHistory(
        presale.pairAddress.toLowerCase(),
        page
      );
    },
    { refetchInterval: 5000 }
  );
  const hasNextPage = useQuery(["swap-history", presale, page + 1], () =>
    LaunchpadQueries[presale.chainId].fetchSwapHistory(
      presale.pairAddress.toLowerCase(),
      page + 1
    )
  );
  return {
    ...query,
    hasNext: !!hasNextPage.data?.length,
  };
}
