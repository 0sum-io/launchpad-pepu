import { addresses } from "constants/addresses";
import { getPresaleContract } from "contracts/evm/contract/PresaleContract";
import { getPresaleManagerContract } from "contracts/evm/contract/PresaleManagerContract";
import { useAddress } from "hooks/on-chain";
import { useSessionStorage } from "hooks/useStorage";
import { EVMChainId } from "models/ChainId";
import { useQuery } from "react-query";
import { LaunchpadQueries } from "remotes/graphql";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { getEVMProvider } from "utils/on-chain";


export function usePresaleList() {
  const list1 = usePresaleListOfChain(EVMChainId.CHAIN);

  return {
    ...list1,
  };
}

export function usePresaleListOfChain(chainId: number) {
  return useQuery<ParsedPresale[]>(
    ["presales-all", chainId],
    async () => LaunchpadQueries[chainId].fetchPresales(),
    {
      refetchInterval: 10000,
    }
  );
}

export function usePresale(token: string) {
  const query = usePresaleList();
  return query.data?.find(
    (i) => i.token.toLowerCase() === token?.toLowerCase()
  );
}

export function usePresaleByRPC(token: string) {
  const query = useQuery<ParsedPresale>({
    queryKey: ["presale-by-rpc", token],
    queryFn: async () => {
      const provider = getEVMProvider(EVMChainId.CHAIN);
      const contract = getPresaleManagerContract(
        addresses[EVMChainId.CHAIN].contract.PresaleManager,
        provider
      );
      const presaleAddress = await contract.getPresale(token);
      const presaleContract = getPresaleContract(presaleAddress, provider);
      const info = await presaleContract.info();
      const tokenInfo = await presaleContract.tokenInfo();
      const result: ParsedPresale = {
        ...info,
        id: token,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        paymentToken: info.paymentToken,
        presaleAmount: info.amountToRaise,
        pairAddress: info.pool,
        token: token,
        chainId: EVMChainId.CHAIN,
        data: JSON.parse(info.data),
      };
      return result;
    },
  });
  return query.data;
}

export function useIsMinter(token: string) {
  const presale = usePresale(token);
  const address = useAddress();
  return presale?.minter.toLowerCase() === address?.toLowerCase();
}

export function useSort() {
  return useSessionStorage<string>("sort", "CREATE_ORDER");
}

export function useOrder() {
  return useSessionStorage<string>("order", "desc");
}
