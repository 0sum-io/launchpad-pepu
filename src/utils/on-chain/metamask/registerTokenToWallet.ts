import { ExternalProvider } from "@ethersproject/providers";

export async function registerTokenToWallet(
  provider: ExternalProvider,
  tokenAddress: string,
  tokenSymbol: string,
  decimals: number,
  image: string
) {
  if (!provider.request) {
    return;
  }
  try {
    await provider.request({
      method: "wallet_watchAsset",
      params: {
        //@ts-ignore
        type: "ERC20",
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: decimals, // The number of decimals in the token
          image: image, // A string url of the token logo
        },
      },
    });
  } catch (e) {
    console.error(e);
  }
}
