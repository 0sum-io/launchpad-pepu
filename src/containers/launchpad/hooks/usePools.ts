import { useChainId } from "hooks/on-chain";
import { flatMap } from "lodash";
import { EVMChainId } from "models/ChainId";
import { useQuery } from "react-query";
import { LaunchpadQueries } from "remotes/graphql";
import { RawPool } from "remotes/graphql/launchpad/chain";

export function usePools(defaultChainId?: EVMChainId) {
  const chainId = useChainId();
  const targetChainId = defaultChainId || chainId;
  return useQuery<RawPool[]>(["pools", targetChainId], () =>
    Promise.all(
      Object.values(LaunchpadQueries).map((i) => i.fetchPools())
    ).then((res) => flatMap(res))
  );
}

export function usePool(id: string) {
  const query = usePools();
  return query.data?.find((i) => i.id?.toLowerCase() === id?.toLowerCase());
}
