import { useQuery } from "react-query";
import { LaunchpadQueries } from "remotes/graphql";
import {
  ParsedPresale,
  SwapHistory,
} from "remotes/graphql/launchpad/chain";
import { getV3PairAddress } from "utils/getV3PairAddress";
import { getV3Txns } from "utils/getV3Txns";

export function useSwapHistory(presale: ParsedPresale, page: number) {
  const query = useQuery<SwapHistory[]>(
    ["swap-history", presale, page],
    async () => {
      if (presale.isEnd) {
        const pairAddress = await getV3PairAddress(
          presale.paymentToken,
          presale.id
        );
        return await getV3Txns(
          pairAddress.toLowerCase(),
          page
        );
      }
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
