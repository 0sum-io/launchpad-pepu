import { addresses } from "constants/addresses";
import { getPresaleContract } from "contracts/evm/contract/PresaleContract";
import { getPresaleManagerContract } from "contracts/evm/contract/PresaleManagerContract";
import { useQuery } from "react-query";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { getEVMProvider } from "utils/on-chain";

export function useBondingCurveProgress(presale?: ParsedPresale) {
  const query = useQuery(
    ["bondig-curve-progress", presale?.id],
    async () => {
      if (!presale) {
        return 0;
      }
      const provider = getEVMProvider(presale.chainId);
      const contract = getPresaleManagerContract(
        addresses[presale.chainId]?.contract?.PresaleManager,
        provider
      );
      const presaleAddress = await contract.getPresale(presale.token);
      const isEnd = await getPresaleContract(presaleAddress, provider).isEnd();
      if (isEnd) {
        return 100;
      }
      const rate = await contract.getProgress(presale.id);
      return rate * 100;
    },
    { refetchInterval: 10000 }
  );
  return query;
}

export function useRaisedAmount(presale?: ParsedPresale) {
  return useQuery({
    queryKey: ["presale-raised-amount2", presale?.id],
    queryFn: async () => {
      const provider = getEVMProvider(presale.chainId);
      const contract = getPresaleManagerContract(
        addresses[presale.chainId]?.contract?.PresaleManager,
        provider
      );
      const presaleAddress = await contract.getPresale(presale.token);
      const presaleContract = getPresaleContract(presaleAddress, provider);
      return await presaleContract.getRaisedAmount();
    },
    enabled: !!presale,
    refetchInterval: 5000,
  });
}
