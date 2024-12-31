import { useChainId } from "hooks/on-chain";
import { EVMChainId } from "models/ChainId";
import { useQuery } from "react-query";
import { LaunchpadQueries } from "remotes/graphql";

export function usePoolDatas(defaultChainId: EVMChainId, pool: string) {
  const chainId = useChainId();
  const targetChainId = defaultChainId || chainId;
  return useQuery(["poolDatas", pool, targetChainId], () =>
    LaunchpadQueries[targetChainId]?.fetchPoolMinuteDatas(pool)
  );
}
