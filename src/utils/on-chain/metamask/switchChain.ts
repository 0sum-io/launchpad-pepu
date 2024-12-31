import { ExternalProvider } from "@ethersproject/providers";

import { chains } from "constants/chains";
import { EVMChainId } from "models/ChainId";

export async function switchChain(
  provider: ExternalProvider,
  chainId: EVMChainId
) {
  const formattedChainId = `0x${chainId.toString(16)}`;
  const chainInfo = chains[chainId];
  if (!provider.request) {
    return;
  }
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: formattedChainId }],
    });
  } catch (error) {
    if ((error as { code: number }).code == 4902) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: formattedChainId,
              chainName: chainInfo.chainName,
              rpcUrls: chainInfo.rpcUrls,
              nativeCurrency: chainInfo.nativeCurrency,
              blockExplorerUrls: chainInfo.blockExplorerUrls,
            },
          ],
        });
      } catch (addError) {
        throw addError;
      }
      return;
    }
    throw error;
  }
}
