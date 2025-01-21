export async function fetchQuote(): Promise<string> {
  const query = `
    query GetDexPrice {
    pools(
      where: {
        and: [
          # USDT
          { token0_: { name: "USDT" } }
          # WPEPU
          { token1_: { id: "${process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY.toLowerCase()}" } }
        ]
      }
    ) {
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
  return json.data.pools[0].token0Price;
}
