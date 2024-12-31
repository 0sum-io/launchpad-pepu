import { getERC20Contract } from "contracts/index";
import { Web3Provider } from "@ethersproject/providers";

export async function approve(
  address: string,
  spender: string,
  provider: Web3Provider
) {
  const token = getERC20Contract(address, provider);
  await token.approve(spender);
}
