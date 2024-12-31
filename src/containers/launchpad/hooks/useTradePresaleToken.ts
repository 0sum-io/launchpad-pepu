import { useAsyncCallback } from "@boxfoxs/core-hooks";
import { useTransactionSnackbar } from "components/snackbar";
import { useERC20Contract, useSwapRouterContract } from "contracts/evm";
import { ContractTransaction } from "ethers";
import { useAddress, useProvider, useProviderForSign } from "hooks/on-chain";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { checkIsNative } from "utils/checkIsNative";
import { useBondingCurveProgress } from "./useBondingCurveProgress";

export function useTradePresaleToken(data: ParsedPresale) {
  const progress = useBondingCurveProgress(data);
  const provider = useProvider();
  const address = useAddress();
  const token = useERC20Contract(data.token);
  // const paymentToken = useERC20Contract(data.paymentToken);
  const signer = useProviderForSign();
  const swapRouter = useSwapRouterContract(data.chainId, signer);
  const txSnacbkar = useTransactionSnackbar();

  const buy = useAsyncCallback(async (amount: string) => {
    const block = await provider.getBlock("latest");
    const deadline = block.timestamp + 1000;
    const isETH = checkIsNative(data.chainId, data.paymentToken);
    const wethBalance = 0;
    // const wethBalance = await paymentToken
    //   .balanceOf(address)
    //   .then(formatEther)
    //   .then(Number);
    // const allowance = await paymentToken.allowance(address, swapRouter.address);
    // if (wethBalance && allowance < Number(amount)) {
    //   const tx = await paymentToken.approve(swapRouter.address);
    //   await txSnacbkar(
    //     tx,
    //     {
    //       pending: "Approve in progress",
    //       success: "Approve successful",
    //     },
    //     data.chainId
    //   );
    // }
    let tx: ContractTransaction;
    if (isETH) {
      tx = await swapRouter.exactInputSingleETH(
        data.paymentToken,
        data.token,
        address,
        deadline,
        Number(amount),
        Number(amount) - Math.min(Number(amount), wethBalance),
        0,
        0
      );
    } else {
      tx = await swapRouter.exactInputSingle(
        data.paymentToken,
        data.token,
        address,
        deadline,
        Number(amount),
        0,
        0
      );
    }

    await txSnacbkar(
      tx,
      {
        pending: "Swap in progress",
        success: "Swap successful",
      },
      data.chainId
    );
    progress.refetch();
  });

  const sell = useAsyncCallback(async (amount: string) => {
    const allowance = await token.allowance(address, swapRouter.address);
    if (allowance < Number(amount)) {
      const tx = await token.approve(swapRouter.address);
      await txSnacbkar(
        tx,
        {
          pending: "Approve in progress",
          success: "Approve successful",
        },
        data.chainId
      );
    }
    const block = await provider.getBlock("latest");
    const deadline = block.timestamp + 1000;
    const tx = await swapRouter[
      checkIsNative(data.chainId, data.paymentToken)
        ? "exactInputSingleWithUnwrap"
        : "exactInputSingle"
    ](data.token, data.paymentToken, address, deadline, Number(amount), 0, 0);
    await txSnacbkar(
      tx,
      {
        pending: "Swap in progress",
        success: "Swap successful",
      },
      data.chainId
    );
    progress.refetch();
  });
  return { buy, sell };
}