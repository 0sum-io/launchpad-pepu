export const WALLET_ERROR = {
  USER_REJECTED_TX: 4001,
  PLEASE_WAIT: -32002,
  INSUFFICIENT_GAS: -32603,
  isUserRejected: (code?: string | number) =>
    code === WALLET_ERROR.USER_REJECTED_TX || code === "ACTION_REJECTED",
  isPending: (code?: string | number) => code === WALLET_ERROR.PLEASE_WAIT,
  isInsufficientGas: (code?: string | number) =>
    String(code) === String(WALLET_ERROR.INSUFFICIENT_GAS) ||
    code === "UNPREDICTABLE_GAS_LIMIT",
};

/*
 * Used for Typescript try/catch error parsing. Example:
 *    if (isWalletError(error) && error.code !== USER_REJECTED_TX) {
 *       console.error(error)
 *    }
 */
export class WalletError extends Error {
  constructor(
    readonly code: number,
    readonly message: string,
    readonly data?: unknown,
    readonly stack?: string
  ) {
    super();
  }
}

export const isWalletError = (error: unknown): error is WalletError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
};
