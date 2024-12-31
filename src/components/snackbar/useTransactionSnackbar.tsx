import { useTransactionResultSnackbar } from "components/snackbar";
import { ContractTransaction } from "ethers";
import { ReactNode, useCallback } from "react";

export function useTransactionSnackbar() {
  const txSnackbar = useTransactionResultSnackbar();
  return useCallback(
    async (
      tx: ContractTransaction,
      message: { pending: ReactNode; success: ReactNode },
      chainId: number
    ) => {
      const id = txSnackbar.pending(message.pending, tx.hash, chainId);
      try {
        await tx.wait();
        txSnackbar.success(message.success, tx.hash, chainId, 5000);
      } catch {
        txSnackbar.fail("Transaction failed", tx.hash, chainId, 5000);
      } finally {
        txSnackbar.close(id);
      }
    },
    [txSnackbar]
  );
}
