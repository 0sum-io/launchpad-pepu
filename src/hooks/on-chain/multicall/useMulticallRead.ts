import { useQuery } from "react-query";
import { useMulticall } from "./useMulticall";
import { useChainId } from "../useChain";

export function useMulticallRead(
  targets: string[],
  contractInterface: any[],
  methodName: string,
  callInputs?: any[],
  chainId?: number | string
) {
  const defaultChainId = useChainId();
  const multicall = useMulticall(chainId ?? defaultChainId);

  const query = useQuery(
    [
      "multicall3",
      JSON.stringify(targets),
      methodName,
      JSON.stringify(callInputs),
      multicall != null,
    ],
    async () => {
      if (!multicall) {
        return;
      }
      const res = await multicall.call(
        targets.map((contractAddress) => ({
          contractAddress,
          abi: contractInterface,
          calls: [
            {
              methodName,
              methodParameters: callInputs,
              reference: contractAddress,
            },
          ],
          reference: contractAddress,
        }))
      );

      return targets.map((address) => ({
        returns: res.results[address].callsReturnContext[0].returnValues,
        address,
        isValid: res.results[address].callsReturnContext[0].success,
      }));
    },
    { refetchInterval: 10000 }
  );
  return query;
}
