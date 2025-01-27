export async function fetchQuote(): Promise<string> {
  if (!process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY)
    throw new Error("NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY is not set");

  const query = `
   query GetDexPrice {
    pools(
      where: {
        or: [
          { 
            and: [
              { token0_: { symbol: "USDT" } }
              { token1_: { id: "${process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY.toLowerCase()}" } }
            ]
          }
          { 
            and: [
              { token0_: { id: "${process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY.toLowerCase()}" } }
              { token1_: { symbol: "USDT" } }
            ]
          }
          { 
            and: [
              { token0_: { symbol: "USDC" } }
              { token1_: { id: "${process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY.toLowerCase()}" } }
            ]
          }
          { 
            and: [
              { token0_: { id: "${process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY.toLowerCase()}" } }
              { token1_: { symbol: "USDC" } }
            ]
          }
        ]
      }
      orderBy: txCount
      orderDirection: desc
    ) {
      token0 {
        id
      }
      token1 {
        id
      }
      token0Price
      token1Price
    }
  }
  `;

  const json = await fetch(process.env.NEXT_PUBLIC_V3_GRAPH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((res) => res.json());

  if (
    json.data.pools[0].token0.id ===
    process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY.toLowerCase()
  ) {
    return json.data.pools[0].token1Price;
  }

  if (
    json.data.pools[0].token1.id ===
    process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY.toLowerCase()
  ) {
    return json.data.pools[0].token0Price;
  }
}
