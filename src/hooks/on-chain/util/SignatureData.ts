enum PermitType {
  AMOUNT = 1,
  ALLOWED = 2,
}

interface PermitInfo {
  type: PermitType;
  name: string;
  // version is optional, and if omitted, will not be included in the domain
  version?: string;
}

export enum UseERC20PermitState {
  // returned for any reason, e.g. it is an argent wallet, or the currency does not support it
  NOT_APPLICABLE,
  LOADING,
  NOT_SIGNED,
  SIGNED,
}

interface BaseSignatureData {
  v: number;
  r: string;
  s: string;
  deadline: number;
  nonce: number;
  owner: string;
  spender: string;
  chainId: number;
  tokenAddress: string;
  permitType: PermitType;
}

export interface StandardSignatureData extends BaseSignatureData {
  amount: string;
}

export interface AllowedSignatureData extends BaseSignatureData {
  allowed: true;
}

export type SignatureData = StandardSignatureData | AllowedSignatureData;
