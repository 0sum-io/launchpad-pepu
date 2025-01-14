import { ethers } from 'ethers'
import { CurrentConfig } from './config'
import { computePoolAddress, FeeAmount } from '@uniswap/v3-sdk'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import {
  POOL_FACTORY_CONTRACT_ADDRESS,
  QUOTER_CONTRACT_ADDRESS,
  WPEPU_TOKEN,
  USDC_TOKEN,
} from './libs/constants'
import { getProvider } from './libs/providers'
import { fromReadableAmount } from './libs/conversion'

export async function fetchQuote(): Promise<string> {
  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    getProvider()
  )

  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    WPEPU_TOKEN.address,
    USDC_TOKEN.address,
    FeeAmount.MEDIUM,
    fromReadableAmount(
      CurrentConfig.tokens.amountIn,
      CurrentConfig.tokens.in.decimals
    ).toString(),
    0
  )

  const readablePrice = ethers.utils.formatUnits(quotedAmountOut, 6);
  return readablePrice
}