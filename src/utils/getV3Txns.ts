export async function getV3Txns(
  pairAddress: string,
  page: number,
) {
  const query = `query GetV3Txns {
    swaps(
      where: {pool_: {id: "${pairAddress.toLowerCase()}"}}
      skip: ${page}
      first: 10
      orderBy: timestamp
      orderDirection: desc
    ) {
      amount0
      amount1
      amountUSD
      id
      logIndex
      origin
      recipient
      sender
      sqrtPriceX96
      tick
      timestamp
      transaction {
        id
      }
      pool {
        id
        token0 {
          id
          name
          symbol
        }
        token1 {
          id
          name
          symbol
        }
      }
    }
  }`;
  const res = await fetch(process.env.NEXT_PUBLIC_V3_GRAPH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  return data.data.swaps;
}
