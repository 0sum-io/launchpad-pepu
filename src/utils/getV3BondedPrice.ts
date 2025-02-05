import { ethers } from "ethers";
import { getEVMProvider } from "utils/on-chain";

export async function getV3BondedPrice(tokenAddress) {
  const provider = getEVMProvider();
  const quoter = new ethers.Contract(
    process.env.NEXT_PUBLIC_V3_QUOTER,
    [
      {
        inputs: [
          {
            components: [
              { internalType: "address", name: "tokenIn", type: "address" },
              { internalType: "address", name: "tokenOut", type: "address" },
              { internalType: "uint256", name: "amountIn", type: "uint256" },
              { internalType: "uint24", name: "fee", type: "uint24" },
              {
                internalType: "uint160",
                name: "sqrtPriceLimitX96",
                type: "uint160",
              },
            ],
            internalType: "struct IQuoterV2.QuoteExactInputSingleParams",
            name: "params",
            type: "tuple",
          },
        ],
        name: "quoteExactInputSingle",
        outputs: [
          { internalType: "uint256", name: "amountOut", type: "uint256" },
          {
            internalType: "uint160",
            name: "sqrtPriceX96After",
            type: "uint160",
          },
          {
            internalType: "uint32",
            name: "initializedTicksCrossed",
            type: "uint32",
          },
          { internalType: "uint256", name: "gasEstimate", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    provider
  );
  const price = await quoter.callStatic.quoteExactInputSingle({
    tokenIn: process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY,
    tokenOut: tokenAddress, // "0xe1936f69f7bc8c97ebb18ddf09e9c77fc7284833",
    fee: 10000,
    recipient: process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY,
    deadline: Math.floor(new Date().getTime() / 1000 + 60 * 10),
    amountIn: ethers.utils.parseUnits("1"),
    sqrtPriceLimitX96: 0,
  });
  return price.amountOut;
}
