import { useRecoilState } from "recoil";
import { feeState } from "./feeState";
import { useCallback } from "react";
import { toWei } from "web3-utils";

export function useFeeState() {
  const [state, update] = useRecoilState(feeState);
  const updateMaxFee = useCallback((val?: string | number) => {
    update((prev) => ({
      ...prev,
      maxFee: val != null ? toWei(val, "gwei") : undefined,
    }));
  }, []);
  const updateMaxPriorityFeePerGas = useCallback((val?: string | number) => {
    update((prev) => ({
      ...prev,
      maxFee: val != null ? toWei(val, "gwei") : undefined,
    }));
  }, []);
  return { ...state, updateMaxFee };
}
