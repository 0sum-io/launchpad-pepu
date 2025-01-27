export async function fetchQuote(): Promise<string> {
  const query = `
   query GetDexPrice {
    pools(
      where: {
        or: [
          { 
            and: [
              { token0_: { symbol: "USDT" } }
              { token1_: { id: "0x4200000000000000000000000000000000000006" } }
            ]
          }
          { 
            and: [
              { token0_: { id: "0x4200000000000000000000000000000000000006" } }
              { token1_: { symbol: "USDT" } }
            ]
          }
          { 
            and: [
              { token0_: { symbol: "USDC" } }
              { token1_: { id: "0x4200000000000000000000000000000000000006" } }
            ]
          }
          { 
            and: [
              { token0_: { id: "0x4200000000000000000000000000000000000006" } }
              { token1_: { symbol: "USDC" } }
            ]
          }
        ]
      }
      orderBy: txCount
      orderDirection: desc
    ) {
      token0Price
      token1Price
      txCount
      feeTier
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
  return json.data.pools[0].token0Price;
}
