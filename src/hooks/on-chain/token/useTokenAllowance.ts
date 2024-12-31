import { Currency } from "@sushiswap/core-sdk";
import { getERC20Contract } from "contracts/index";
import { useQuery } from "react-query";
import { getEVMProvider } from "utils/on-chain";
import useBlock from "../useBlock";
import { useAccount } from "../useConnectWallet";

export default function useTokenAllowance(token: Currency, spender: string) {
  const { blockNumber } = useBlock();
  const account = useAccount();

  const { data, refetch } = useQuery<number>(
    ["allowance", token?.wrapped.address, token?.chainId, spender, blockNumber],
    async () => {
      if (!account || !token) {
        return 0;
      }
      const balance = await getERC20Contract(
        token.wrapped.address,
        getEVMProvider(token.chainId)
      ).allowance(account, spender);
      return balance;
    },
    {
      enabled: !!token && account !== undefined,
      placeholderData: 0,
    }
  );
  return [data, refetch] as const;
}
