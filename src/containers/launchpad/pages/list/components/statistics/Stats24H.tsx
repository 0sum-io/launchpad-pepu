import { Spacing } from "@boxfoxs/bds-web";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useSortedPresaleList } from "containers/launchpad/hooks";
import { usePools } from "containers/launchpad/hooks/usePools";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import { useTokenInfo } from "hooks/on-chain";
import { fetchQuote } from "hooks/on-chain/useDEXPrice";
import { useEffect, useMemo, useState } from "react";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { addressIsSame } from "utils/addressIsSame";
import { checkIsNative, getClearedSymbol } from "utils/checkIsNative";
import { formatDecimals, shortenAddress } from "utils/format";
import { pressableStyle } from "utils/style";

const Stats24H = () => {
  const sortedPresales = useSortedPresaleList();
  let [sortedPresalesTable, setData] = useState([]);
  const pools = usePools();

  const dexPrice = 0.00987;

  /* let [dexPrice, setDexPrice] = useState(0);

  useEffect(() => {
    const fetchDexPrice = async () => {
      const price = await fetchQuote();
      console.log("Dex price: ", price);
      setDexPrice(parseFloat(price));
    };
    fetchDexPrice();
  }, []); */

  // console.log("sortedPresales", sortedPresales);

  const sumSwapsByToken = (swaps, tokenInfo) => {
    // Create an object to store the sum for each token
    const tokenSums = {};

    // Iterate through all swaps
    swaps.forEach((swap) => {
      const tokenId = swap.token0.id;
  
      // Skip the specific token based on its ID or name
      if (tokenId === "0xbe4c021f8fd2be76dbe9da6a000221ac6893aa3d") {
        return; // Skip this token
      }
  
      const volume = parseFloat(swap.token0.volume);
  
      // Initialize the sum for the token if not present
      if (!tokenSums[tokenId]) {
        const tokenDetails = tokenInfo.find((info) => info.token === tokenId) || {};

        // console.log("Token swap data: ", swap);
        
        let tokenAmount0 = parseFloat(swap.amount0);
        let tokenAmount1 = parseFloat(swap.amount1);
        
        tokenAmount0 = tokenAmount0 < 0 ? (tokenAmount0 * -1) : tokenAmount0;
        tokenAmount1 = tokenAmount1 < 0 ? (tokenAmount1 * -1) : tokenAmount1;
    
        // console.log("Price in USD: ", (tokenAmount1 / tokenAmount0) * dexPrice);

        tokenSums[tokenId] = {
          id: tokenId,
          name: swap.token0.name,
          symbol: swap.token0.symbol,
          volume: volume,
          token0Amount: tokenAmount0,
          token1Amount: tokenAmount1,
          price: tokenAmount1 / tokenAmount0,
          priceInUSD: (tokenAmount1 / tokenAmount0) * dexPrice,
          marketCap: ((tokenAmount1 / tokenAmount0) * dexPrice) * 1000000000,
          percentageChange: ((((tokenAmount1 / tokenAmount0) * dexPrice) * 1000000000) / 150) * 100,
          xChange: ((((tokenAmount1 / tokenAmount0) * dexPrice) * 1000000000) / 150),
          tokenInfo: tokenDetails || {}, // Add the corresponding token info
        };
      }
  
      // Add the current swap's volume to the total volume for the token
      // tokenSums[tokenId].volume += volume;
    });

    // Convert the sums object into an array of results
    // Return sorted results by volume
    return Object.values(tokenSums).sort((a: any, b: any) => (b.volume * b.priceInUSD) - (a.volume * a.priceInUSD));
  }

  useEffect(() => {
    if (!sortedPresales || !pools.data || dexPrice === 0) return;

    // derive market cap from pools and presales
    const withVolumeInWpepu = sortedPresales.map((i) => {
      const data = pools.data.find((v) => addressIsSame(v.id, i.pairAddress));
      const volumeInWpepu = addressIsSame(data.token0.id, i.token)
        ? data.volumeToken1
        : data.volumeToken0;
      return { ...i, volumeInWpepu };
    });
    // console.log("withVolumeInWpepu", withVolumeInWpepu);
    // fetch last swap data
    fetchData(withVolumeInWpepu);

    const interval = setInterval(() => {
      // console.log("fetching data");
      fetchData(withVolumeInWpepu);
    }, 5000);

    return () => clearInterval(interval);
  }, [sortedPresales, pools.data, dexPrice]);

  // fetch data from graphql
  const fetchData = async (withVolumeInWpepu: any[]) => {
    const query = `
        query LastSwap {
          swaps(orderBy: timestamp, orderDirection: desc) {
            token0 {
              name
              id
              volume
              symbol
            }
            amount0
            amount1
          }
        }
    `;

    const json = await fetch(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());

    // Deduplicate swaps by token0 ID
    const uniqueSwaps = [];
    const seenTokenIds = new Set();

    json.data.swaps.forEach((swap) => {
      if (!seenTokenIds.has(swap.token0.id)) {
        uniqueSwaps.push(swap);
        seenTokenIds.add(swap.token0.id);
      }
    });
    // json is swap data only
    // console.log("uniqueSwaps ---> ", uniqueSwaps);

    const presales = sumSwapsByToken(uniqueSwaps, withVolumeInWpepu);
    // console.log("Final Data ---> ", presales);

    setData(presales);
  };

  return (
    <div>
      <table style={{ width: "100%", minWidth: "748px", borderSpacing: 0 }}>
        <thead>
          <tr>
            <TableHeader> Token name </TableHeader>
            <TableHeader> Marketcap </TableHeader>
            <TableHeader> 24h Volume </TableHeader>
            <TableHeader> Performance </TableHeader>
          </tr>
        </thead>
        <tbody>
          {!sortedPresalesTable?.length ? (
            <Spacing height={56} />
          ) : (
            sortedPresalesTable?.map((item) => {
              /* const amount0IsNative = checkIsNative(
                list.chainId,
                item.pool.token0.id
              );
              const isSell = amount0IsNative
                ? item.amount0 < 0
                : item.amount1 < 0; */
              return (
                <TableBodyRow key={item.tokenInfo.id} onClick={() => window.location.href=`/${item.tokenInfo.token}`}>
                    <TableBody width={23} style={{ display: "flex", alignItems: "center", width: "100%" }}>
                      <StyledImage src={item?.tokenInfo?.data?.iconUrl} />
                      <p style={{ paddingLeft: "10px" }}>{item.tokenInfo.name}</p>
                    </TableBody>
                    <TableBody width={23}>
                      ${commaizeNumber(
                        formatDecimals(
                          Math.abs(item.marketCap),
                          2
                        )
                      )}
                    </TableBody>
                    <TableBody width={23}>
                      ${commaizeNumber(
                        formatDecimals(
                          Math.abs(item.volume * item.priceInUSD),
                          2
                        )
                      )}
                    </TableBody>
                    <TableBody width={23}>
                      {commaizeNumber(
                        formatDecimals(
                          Math.abs(item.xChange),
                          2
                        )
                      )}x
                    </TableBody>
                    <TableBody width={8}>
                      <a
                        href={`/${
                          item.tokenInfo.token
                        }`}
                        rel="noreferrer"
                      >
                        <img
                          src="/images/ic_expand_window.svg"
                          alt="expand"
                          width={14}
                        />
                      </a>
                    </TableBody>
                </TableBodyRow>
              );
            })
          )}
        </tbody>
      </table>
      <Spacing height={8} />
      {/* <Flex.Center>
        <LeftButton
          onClick={() => page > 1 && setPage((prev) => prev - 1)}
          width={18}
          color={page > 1 ? colors.white : colors.gray600}
        />
        <Text size="base" color={colors.white} center style={{ width: "50px" }}>
          {page}
        </Text>
        <RightButton
          onClick={() => history.hasNext && setPage((prev) => prev + 1)}
          width={18}
          color={history.hasNext ? colors.white : colors.gray600}
        />
      </Flex.Center> */}
    </div>
  );
}

export default Stats24H;

const TableHeader = styled.th`
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
  text-align: left;
`;

const TableBodyRow = styled.tr`
  :last-child td {
    border-bottom: none;
  }
`;

const TableBody = styled.td<{ width?: number }>`
  padding: 16px 0;
  color: #fff;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  width: ${(p) => p.width}%;
  border-bottom: 1px solid #272727;
`;

const LeftButton = styled(ChevronLeftIcon)`
  cursor: pointer;
  ${pressableStyle.opacity()}
`;
const RightButton = styled(ChevronRightIcon)`
  cursor: pointer;
  ${pressableStyle.opacity()}
`;

function getTimeLabel(timestamp: number) {
  const time = new Date(timestamp * 1000);
  const now = new Date();

  const days = Math.abs(Math.floor(differenceInDays(now, time)));
  const hours = Math.abs(Math.floor(differenceInHours(now, time))) % 24;
  const minutes = Math.abs(Math.floor(differenceInMinutes(now, time))) % 60;
  const seconds = Math.abs(Math.floor(differenceInSeconds(now, time))) % 60;

  if (days > 0) {
    return `${days}d ${hours}h ago`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ago`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s ago`;
  }
  return `${seconds}s ago`;
}

const StyledImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid #272727;
  object-fit: cover;
`;