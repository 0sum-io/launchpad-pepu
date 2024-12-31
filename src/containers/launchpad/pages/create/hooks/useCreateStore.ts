import { WNATIVE } from "constants/tokens";
import { useSessionStorage } from "hooks/useStorage";
import { EVMChainId } from "models/ChainId";
import { useCallback, useMemo, useState } from "react";

export interface MakePresaleFormState {
  network: EVMChainId;
  curve: "linear" | "flat";
  paymentToken: { address: string; symbol: string; decimals: number };
  name: string;
  symbol: string;
  totalSupply: number;
  amountToRaise: string | number;
  minterAllocation: number;

  description: string;
  websiteUrl: string;
  xUrl: string;
  discordUrl: string;
  telegramUrl: string;

  icon: { name: string; file: File; data: string };
  thumbnail: { name: string; file: File; data: string };
}

export function useCreatePresaleState() {
  const [state, setState] = useSessionStorage("create-presale");
  const [error, setError] = useState<
    Partial<Record<keyof MakePresaleFormState, string | boolean>>
  >({});
  const value = useMemo<MakePresaleFormState>(
    () => (state ? JSON.parse(state) : defaultState),
    [state]
  );
  const update = useCallback(
    (partial: Partial<MakePresaleFormState>) => {
      setError({});
      setState(JSON.stringify({ ...value, ...partial }));
    },
    [value]
  );
  const clear = useCallback(() => setState(JSON.stringify(defaultState)), []);
  return { value, update, clear, error, setError };
}

const defaultState = {
  network: EVMChainId.CHAIN,
  paymentToken: {
    address: WNATIVE[EVMChainId.CHAIN].address,
    symbol: process.env.NEXT_PUBLIC_CHAIN_SYMBOL,
    decimals: 18,
  },
  curve: "linear",
};
