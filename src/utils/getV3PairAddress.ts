export async function getV3PairAddress(
  token0: string,
  token1: string
): Promise<string> {
  const query = `query GetPairAddress {
    pools(where: { 
      or: [
        { 
          and: [
            { token0: "${token0.toLowerCase()}" },
            { token1: "${token1.toLowerCase()}" }
          ] 
        },
        { 
          and: [
            { token0: "${token1.toLowerCase()}" },
            { token1: "${token0.toLowerCase()}" }
          ] 
        }
      ]
    }) {
      id
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
  return data.data.pools[0].id;
}
