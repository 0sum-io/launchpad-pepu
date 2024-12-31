import { GenericEVMContract } from "contracts/evm";
import { useMulticallRead } from "./useMulticallRead";

export function useSingleCallRead(
  contract: GenericEVMContract,
  methodName: string,
  args?: any[],
  chainId?: number | string
) {
  const res = useMulticallRead(
    [contract.address],
    contract.abi,
    methodName,
    args,
    chainId
  );
  return { isLoading: res.isLoading, data: res.data[0] };
}
