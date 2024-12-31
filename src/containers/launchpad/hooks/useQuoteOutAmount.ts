import { formatEther } from "@ethersproject/units";
import { useQuery } from "@tanstack/react-query";
import { useQuoterContract } from "contracts/evm/contract/UniswapV3SwapQuoterContract";
import { useAccount } from "hooks/on-chain";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";

export function useQuoteOutAmount(data: ParsedPresale, amount: string) {
  const address = useAccount();
  const quoter = useQuoterContract();

  return useQuery({
    queryKey: [`quote`, data.paymentToken, data.token, amount, address],
    queryFn: async () => {
      if (!quoter) {
        return;
      }

      const res = await quoter.quoteExactInputSingle(
        data.paymentToken,
        data.token,
        Number(amount),
        0
      ).catch((e) => console.error(e));

      return Number(formatEther(res));
    },
    enabled: !!amount,
    refetchInterval: 5000,
  });
}