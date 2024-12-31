import { useQuery } from "react-query";
import { useProvider } from "./useChain";

export default function useBlock() {
  const provider = useProvider();

  const { data: blockNumber, refetch } = useQuery(
    ["getBlockNumber"],
    async () => await provider.getBlockNumber(),
    {
      staleTime: 1000 * 10,
      enabled: provider !== undefined,
      refetchInterval: 1000 * 10,
    }
  );

  const blockRefetch = () => {
    refetch();
  };

  return { blockNumber, blockRefetch };
}
