export async function getV3Candles(
  unit: string,
  pairAddress: string
) {
  const unitQuery = {
    fetchPoolHourDatas: "poolHourDatas",
    fetchPool4hourDatas: "pool4HourDatas",
    fetchPool15MinuteDatas: "pool15MinuteDatas",
    fetchPoolMinuteDatas: "poolMinuteDatas",
    fetchPoolDayDatas: "poolDayDatas",
  };

  const query = `query GetV3Candles {
    ${unitQuery[unit]}(where: {pool_: {id: "${pairAddress.toLowerCase()}"}}) {
      low
      open
      close
      high
      liquidity
      periodStartUnix
      sqrtPrice
      tick
      token0Price
      token1Price
      tvlUSD
      volumeToken0
      volumeToken1
      volumeUSD
      txCount
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
  return data.data[unitQuery[unit]];
}
