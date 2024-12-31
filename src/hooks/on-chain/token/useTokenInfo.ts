import { Token } from "@sushiswap/core-sdk";
import { getERC20Contract } from "contracts/evm";
import { EVMChainId } from "models/ChainId";
import { useQuery } from "react-query";
import { getEVMProvider } from "utils/on-chain";

export function useTokenInfo(chainId?: EVMChainId, address?: string) {
  return useQuery(
    ["token-info", chainId, address],
    async () => {
      const provider = getEVMProvider(chainId);
      const contract = getERC20Contract(address, provider);
      const symbol = await contract.symbol();
      const name = await contract.name();
      const decimals = await contract.decimals();
      return new Token(chainId, address, decimals, symbol, name);
    },
    { enabled: !!chainId && !!address }
  );
}
