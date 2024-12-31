import EIP2612ABI from "abis/evm/contract/eip-2612.json";
import { useContract } from "hooks/on-chain";
import { GenericEVMContract } from "../common";
import { useQuery } from "react-query";

export class EIP2612Contract extends GenericEVMContract {
  static ABI = EIP2612ABI;

  async nonces(owner: string) {
    return await this.contract.nonces(owner);
  }

  async name() {
    return await this.contract.name();
  }
}

export function useEIP2612Contract(address: string) {
  return useContract(EIP2612Contract, address);
}

export namespace EIP2612Contract {
  export function useNonces(contract: EIP2612Contract, address?: string) {
    const query = useQuery(["nonces", contract.address, address], async () =>
      contract.nonces(address)
    );
    return query.data;
  }

  export function useName(contract: EIP2612Contract) {
    const query = useQuery(["name", contract.address], async () =>
      contract.name()
    );
    return query.data;
  }
}
