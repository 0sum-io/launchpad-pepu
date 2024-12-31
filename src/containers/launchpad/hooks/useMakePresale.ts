import { Provider } from "@ethersproject/abstract-provider";
import { parseEther } from "@ethersproject/units";
import { Token } from "@uniswap/sdk-core";
import { TickMath } from "@uniswap/v3-sdk";
import BigNumber from "bignumber.js";
import { addresses } from "constants/addresses";
import {
  getTokenFactoryContract,
  TokenFactoryContract,
} from "contracts/evm/contract/TokenFactoryContract";
import {
  getUniswapV3PresaleMakerContract,
  UniswapV3PresaleMakerContract,
} from "contracts/evm/contract/UniswapV3PresaleMakerContract";
import { useProvider, useSigner } from "hooks/on-chain";
import { EVMChainId } from "models/ChainId";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { calculateTick } from "utils/calculate-tick";
import { getLiquidity } from "utils/calculate-tick/LiquidityAmounts";
import { getEVMProvider } from "utils/on-chain";

export function useMakePresale() {
  const router = useRouter();
  const provider = useProvider();
  const signer = useSigner();

  return useCallback(
    async (data: CreatePresaleParams) => {
      const presaleMakerContract = getUniswapV3PresaleMakerContract(
        addresses[data.chainId].contract.V3PresaleMaker,
        signer
      );
      const tokenFactory = getTokenFactoryContract(
        addresses[data.chainId].contract.TokenFactory,
        getEVMProvider(data.chainId)
      );
      const tokenAddress = await createPresale(
        provider,
        presaleMakerContract,
        tokenFactory,
        {
          chainId: data.chainId,
          paymentToken: data.paymentToken,
          name: data.name,
          symbol: data.symbol,
          amountToRaise: data.amountToRaise,
          totalSupply: data.totalSupply,
          amountToSale: data.amountToSale,
          amountForBuyInstantly: 0,
          toTreasuryRate: 0,
          startTimestamp: 0,
          data: data.data,
        }
      );
      router.push(`/${tokenAddress}`);
    },
    [provider, signer]
  );
}

export interface CreatePresaleParams {
  chainId: EVMChainId;
  paymentToken: { address: string; symbol: string; decimals: number };
  name: string;
  symbol: string;
  totalSupply: number;
  amountToSale: number;
  amountToRaise: number;
  amountForBuyInstantly?: number;
  toTreasuryRate?: number;
  startTimestamp?: number;
  data: object;
}

export async function createPresale(
  provider: Provider,
  presaleMaker: UniswapV3PresaleMakerContract,
  tokenFactory: TokenFactoryContract,
  params: CreatePresaleParams
) {
  const startPriceTypedValue = new BigNumber(
    params.amountToRaise / params.totalSupply
  ).toFixed();
  const leftRangeTypedValue = startPriceTypedValue;
  const rightRangeTypedValue = "1000000000000000";

  const tokenAddress = await tokenFactory.getTokenAddress(params.totalSupply);
  const currencyA = new Token(
    params.chainId,
    tokenAddress,
    18,
    "Symbol",
    "Name"
  );
  const currencyB = new Token(
    params.chainId,
    params.paymentToken.address,
    params.paymentToken.decimals,
    params.paymentToken.symbol
  );

  const feeAmount = 100;

  const data = calculateTick(
    currencyA,
    currencyB,
    currencyA,
    startPriceTypedValue,
    leftRangeTypedValue,
    rightRangeTypedValue,
    feeAmount
  );
  let sqrtPriceX96 = new BigNumber(
    TickMath.getSqrtRatioAtTick(data.tickLower!).toString()
  );
  const pDesired = 0;
  const tokenDesired = new BigNumber(
    parseEther(String(params.totalSupply)).toString()
  );
  const liquidity = getLiquidity(
    sqrtPriceX96,
    data.tickLower!,
    data.tickUpper!,
    currencyA.sortsBefore(currencyB) ? tokenDesired : new BigNumber(pDesired),
    currencyA.sortsBefore(currencyB) ? new BigNumber(pDesired) : tokenDesired
  );

  if (liquidity.toString() === "0") {
    sqrtPriceX96 = new BigNumber(
      TickMath.getSqrtRatioAtTick(data.tickUpper!).toString()
    );
  }

  const deadline =
    (await provider.getBlock("latest").then((b) => b.timestamp)) + 1000;

  return await presaleMaker.startWithNewToken(
    params.paymentToken.address,
    params.name,
    params.symbol,
    params.totalSupply,
    sqrtPriceX96.toFixed(),
    data.tickLower,
    data.tickUpper,
    params.amountToSale,
    params.amountToRaise,
    params.amountForBuyInstantly,
    params.toTreasuryRate,
    params.startTimestamp,
    deadline,
    JSON.stringify(params.data)
  );
}
