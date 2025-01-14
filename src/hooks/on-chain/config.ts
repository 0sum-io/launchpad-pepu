import { Token } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { USDC_TOKEN, WPEPU_TOKEN } from './libs/constants'

// Inputs that configure this example to run
export interface ExampleConfig {
  rpc: {
    local: string
    mainnet: string
  }
  tokens: {
    in: Token
    amountIn: number
    out: Token
    poolFee: number
  }
}

export const CurrentConfig: ExampleConfig = {
  rpc: {
    local: `${process.env.NEXT_PUBLIC_RPC_URL_MAINNET}`,
    mainnet: `${process.env.NEXT_PUBLIC_RPC_URL_MAINNET}`,
  },
  tokens: {
    in: WPEPU_TOKEN,
    amountIn: 1,
    out: USDC_TOKEN,
    poolFee: FeeAmount.MEDIUM,
  },
}