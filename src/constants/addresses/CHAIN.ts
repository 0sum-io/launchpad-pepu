if (!process.env.NEXT_PUBLIC_MULTICALL)
  throw Error("NEXT_PUBLIC_MULTICALL is not set");
if (!process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY)
  throw Error("NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY is not set");
if (!process.env.NEXT_PUBLIC_PRESALE_MANAGER)
  throw Error("NEXT_PUBLIC_PRESALE_MANAGER is not set");
if (!process.env.NEXT_PUBLIC_TOKEN_FACTORY)
  throw Error("NEXT_PUBLIC_TOKEN_FACTORY is not set");
if (!process.env.NEXT_PUBLIC_SWAP_ROUTER)
  throw Error("NEXT_PUBLIC_SWAP_ROUTER is not set");
if (!process.env.NEXT_PUBLIC_QUOTER)
  throw Error("NEXT_PUBLIC_QUOTER is not set");
if (!process.env.NEXT_PUBLIC_V3_PRESALE_MAKER)
  throw Error("NEXT_PUBLIC_V3_PRESALE_MAKER is not set");

export const CHAIN = {
  contract: {
    Multicall3: process.env.NEXT_PUBLIC_MULTICALL,
    WETH: process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY,
    PresaleManager: process.env.NEXT_PUBLIC_PRESALE_MANAGER,
    TokenFactory: process.env.NEXT_PUBLIC_TOKEN_FACTORY,
    SwapRouter: process.env.NEXT_PUBLIC_SWAP_ROUTER,
    Quoter: process.env.NEXT_PUBLIC_QUOTER,
    V3PresaleMaker: process.env.NEXT_PUBLIC_V3_PRESALE_MAKER,
  },
};
