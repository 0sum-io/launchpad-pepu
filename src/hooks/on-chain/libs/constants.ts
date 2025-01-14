// This file stores web3 related constants such as addresses, token definitions, ETH currency references and ABI's

import { Token } from '@uniswap/sdk-core'

// Addresses

export const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
export const QUOTER_CONTRACT_ADDRESS =
  '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'

// Currencies and Tokens

export const WETH_TOKEN = new Token(
  1,
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  18,
  'WETH',
  'Wrapped Ether'
)

export const WPEPU_TOKEN = new Token(
    1,
    '0xadd39272e83895e7d3f244f696b7a25635f34234',
    18,
    'WPEPU',
    'Pepe Unchained'
  )

export const USDC_TOKEN = new Token(
   1,
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  6,
  'USDC',
  'USD Coin Price'
)