import { useLocalStorage } from "hooks/useStorage";

export function useEVMSelectWallet() {
  return useLocalStorage("walletType");
}

export function useN3SeletWallet() {
  return useLocalStorage("n3walletType");
}
