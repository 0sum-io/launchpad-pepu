import { Currency, CurrencyAmount } from "@sushiswap/core-sdk";
import { NATIVE } from "constants/tokens";
import { getERC20Contract } from "contracts/index";
import { UseQueryOptions, useQuery } from "react-query";
import { checkIsNative } from "utils/checkIsNative";
import { UnsignedNumber } from "utils/format";
import { getEVMProvider } from "utils/on-chain";
import { useAddress, useChain } from "../useChain";

export function useTokenBalance(
  target: Currency,
  options?: UseQueryOptions<CurrencyAmount<Currency>>
): CurrencyAmount<Currency>;
export function useTokenBalance(
  target: string,
  options?: UseQueryOptions<number>
): number;
export function useTokenBalance(
  target: string | Currency,
  options?: UseQueryOptions<number | CurrencyAmount<Currency>>
): number | CurrencyAmount<Currency> {
  const account = useAddress();
  const chain = useChain();

  const chainId =
    !target || typeof target === "string" ? chain.chainId : target.chainId;

  const { data } = useQuery<number | CurrencyAmount<Currency>>(
    [`token-balance`, account, target, chain.chainId, chainId],
    async () => {
      if (!target || !account) {
        return;
      }
      const chainId =
        typeof target === "string" ? chain.chainId : target.chainId;
      const provider = getEVMProvider(chainId);
      if (checkIsNative(chainId, target)) {
        const ethBalance = await provider.getBalance(account);
        return CurrencyAmount.fromRawAmount(
          NATIVE[chain.chainId],
          ethBalance.toString() || "0"
        );
      }
      const address =
        typeof target === "string" ? target : target?.wrapped?.address;

      if (!address) {
        return;
      }
      const contract = getERC20Contract(address, provider);
      const balance = await contract.balanceOf(account);

      if (typeof target === "string") {
        const decimals = await contract.decimals();
        return UnsignedNumber.toFloat(balance, decimals);
      }

      return CurrencyAmount.fromRawAmount(target, balance);
    },
    {
      refetchInterval: 5000,
      refetchOnReconnect: true,
      refetchOnMount: true,
      ...options,
    }
  );
  return data;
}
