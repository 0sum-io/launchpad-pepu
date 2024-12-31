import { atom } from "recoil";

export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30;
export const userDeadline = atom({
  key: "@user/tx-deadline",
  default: DEFAULT_DEADLINE_FROM_NOW,
});
