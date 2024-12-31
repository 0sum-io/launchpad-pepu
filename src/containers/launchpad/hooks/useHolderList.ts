import { ERC20Contract } from "contracts/evm";
import { useMulticall } from "hooks/on-chain";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { LaunchpadQueries } from "remotes/graphql";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";

export interface AccountBalanceDTO {
  account: string;
  balance: string;
}
export function useHolderList(presale: ParsedPresale) {
  const query = useQuery<any>(
    ["holder-list", presale],
    async () => LaunchpadQueries[presale.chainId].fetchHolders(presale.token),
    { refetchOnMount: true, refetchInterval: 10000 }
  );
  const multicall = useMulticall(presale.chainId);
  const query2 = useQuery<AccountBalanceDTO[]>(
    ["holder-list234", query.data],
    async () => {
      const res = await multicall.call({
        contractAddress: presale.token,
        reference: "0",
        abi: ERC20Contract.ABI as any,
        calls: query.data.map((a) => ({
          reference: a.account.address,
          methodName: "balanceOf",
          methodParameters: [a.account.address],
        })),
      });
      return res.results[0].callsReturnContext.map((i) => ({
        account: i.reference,
        balance: i.returnValues[0],
      }));
    }
  );
  return useMemo(() => {
    if (query2.data) {
      return query2.data;
    }
    return query.data?.map((i) => ({
      account: i.account.address,
      balance: i.amount,
    }));
  }, [query.data, query2.data]);
}