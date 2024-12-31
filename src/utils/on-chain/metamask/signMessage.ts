import { ExternalProvider } from "@ethersproject/providers";

export async function signMessage(
  provider: ExternalProvider,
  account: string,
  messageToSign: unknown
) {
  if (!provider?.request) {
    return;
  }
  return await provider?.request({
    method: "personal_sign",
    params: [messageToSign, account],
  });
}
