import { Spacing } from "@boxfoxs/bds-web";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { formatUnits } from "@ethersproject/units";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { LoadingLottie } from "components/lotties/LoadingLottie";
import { useQuoterContract } from "contracts/evm/contract/UniswapV3SwapQuoterContract";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import { fetchQuote } from "hooks/on-chain/useDexPrice";
import { useEffect, useState } from "react";
import { formatDecimals} from "utils/format";
import { pressableStyle } from "utils/style";

const Stats24H = () => {
  let [dexPrice, setDexPrice] = useState(0);
  const [initialMC, setInitialMarketCap] = useState(0);

  // Quoter params
  const quoterContract = useQuoterContract();
  const tokenIn = process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY;
  const [highestPriceTokensOut, setHighestPriceTokensOut] = useState([]);
  const amount = 1;

  // Check PEPU price and set initial market cap
  useEffect(() => {
    const fetchDexPrice = async () => {
      const price = await fetchQuote();
      setDexPrice(parseFloat(price));

      // Now we can calculate inital market cap
      // PEPU price * token worth in PEPU * total supply
      const initialMarketCap = parseFloat(price) * 0.001263 * 1000000000;
      // console.log('initialMarketCap >>>>>', initialMarketCap);

      setInitialMarketCap(initialMarketCap);
    };
    fetchDexPrice();
  }, []);

  // Fetch highest price pool
  useEffect(() => {
    if (dexPrice === 0) return;
    fetchPoolWithHighestPrice();

    // We are setting fetch for presale list here
    /* const interval = setInterval(() => {
      fetchPoolWithHighestPrice();
    }, 15000);

    return () => clearInterval(interval); */
  }, [dexPrice]);

  // fetch pool with highest token price in WPEPU
  const fetchPoolWithHighestPrice = async () => {
    const query = `
        query GetHighestPriceToken {
          poolsByToken0Volume: pools(orderBy: totalValueLockedToken0, orderDirection: desc) {
            id
            totalValueLockedToken0
            totalValueLockedToken1
            token1 {
              name
              symbol
              id
            }
            token0 {
              name
              symbol
              id
            }
            volumeToken0
            volumeToken1
          }
          poolsByToken1Volume: pools(orderBy: totalValueLockedToken1, orderDirection: desc) {
            id
            totalValueLockedToken0
            totalValueLockedToken1
            token1 {
              name
              symbol
              id
            }
            token0 {
              name
              symbol
              id
            }
            volumeToken0
            volumeToken1
          }
          presales(where : { isEnd: false }) {
            pairAddress
          }
        }
    `;

    const highestPriceTokenJson = await fetch(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());

    // Now remove every ended presale from the list
    const filteredData = filterPoolsByPresales(highestPriceTokenJson.data);
    // console.log("filteredData 24H list >>>>>>>>", filteredData);

    const highestTVLTokens = findAllTVLTokensSorted(filteredData);
    // console.log("highestTVLTokens 24H list >>>>>>>>", highestTVLTokens);

    // Fetch presale data for highestTVLTokens
    const tokenDatas = await fetchPresales(highestTVLTokens);
    // console.log("tokenDatas >>>>>>>>", tokenDatas);

    // Match same token with presale data and put 'data' from presale to token
    for (let token of highestTVLTokens) {
      const tokenData = tokenDatas.find((t) => t.id === token.id);
      if (tokenData) {
        token['iconUrl'] = tokenData.data.iconUrl;
        token['description'] = tokenData.data.description;
      }
    }

    setHighestPriceTokensOut(highestTVLTokens);
    // We need iconUrl and description from presale data
  };

  // When we have highestPriceTokensOut, fetch quotes for them
  useEffect(() => {
    if (highestPriceTokensOut) {
      for (let token of highestPriceTokensOut) {
        if (token.totalValueLocked > 0) {
          // Check which token is not PEPU
          const tokenOut = token.token0.symbol != "WPEPU" ? token.token0.id : token.token1.id;
          const tokenPepuVolume = token.token0.symbol === "WPEPU" ? token.volumeToken0 : token.volumeToken1;
  
          // It's reversed input and output because we want to know how much PEPU we get for 1 token
          quoterContract.quoteExactInputSingle(tokenOut, tokenIn, amount, 0)
            .then(quote => {
                // Quote from BN string to number, have 18 decimals
                const quoteNumber = Number(formatUnits(quote, 18));

                // Calculate market cap for token
                token['initialMarketCap'] = initialMC;
                token['marketCap'] = dexPrice * quoteNumber * 1000000000;
                token['volume'] = tokenPepuVolume * dexPrice;
                token['xChange'] = ((dexPrice * quoteNumber * 1000000000) - initialMC) / initialMC * 100;
            })
            .catch(error => {
                console.error("Error fetching quote:", error);
            });
        } else {
          //console.log("Total value locked is 0 for token: ", token);
          // Set all data to 0
          token['marketCap'] = 0;
          token['volume'] = 0;
          token['xChange'] = 0;
        }
      }
    }
  }, [highestPriceTokensOut, dexPrice, initialMC]);

  // When we have highestPriceTokensOut, fetch presale data for them
  const fetchPresales = async (tokenObjects: any) => {
    const tokenIds = tokenObjects.map((token) => {
      if (token.token0.symbol === "WPEPU") {
        return token.token1.id;
      } else {
        return token.token0.id;
      }
    });

    const query = `
      query GetTokensData {
        presales(where: { token_in: [${tokenIds.map(id => `"${id}"`).join(",")}] }) {
          id
          data
          name
          symbol
          token
        }
      }
    `;

    const tokensDataJson = await fetch(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());

    // Every token tokenDataJson.data.presales have data atribute that needs to be JSON.parse
    tokensDataJson.data.presales.forEach((presale) => {
      presale.data = JSON.parse(presale.data);
    });

    return tokensDataJson.data.presales;
};

  function filterPoolsByPresales(data) {
    const presaleAddresses = new Set(data.presales.map(p => p.pairAddress));

    const filteredPoolsByToken0Volume = data.poolsByToken0Volume.filter(pool => 
        presaleAddresses.has(pool.id)
    );

    const filteredPoolsByToken1Volume = data.poolsByToken1Volume.filter(pool => 
        presaleAddresses.has(pool.id)
    );

    return {
        poolsByToken0Volume: filteredPoolsByToken0Volume,
        poolsByToken1Volume: filteredPoolsByToken1Volume,
        presales: data.presales
    };
  };

  function findAllTVLTokensSorted(data, tokenSymbol = "WPEPU") {
    let tvlTokens = [];
    let seenIds = new Set();

    // Iterate through both pools lists
    const poolLists = [data.poolsByToken0Volume, data.poolsByToken1Volume];

    for (const poolList of poolLists) {
        for (const pool of poolList) {
            // Check both token0 and token1
            for (const tokenKey of ["token0", "token1"]) {
                const token = pool[tokenKey];
                const tvlKey = tokenKey === "token0" ? "totalValueLockedToken0" : "totalValueLockedToken1";

                if (token.symbol === tokenSymbol) {
                    const tvl = parseFloat(pool[tvlKey]);

                    // Avoid duplicates by checking pool ID
                    if (!seenIds.has(pool.id)) {
                        tvlTokens.push({
                            id: pool.id,
                            token0: pool.token0,  // Full token0 data
                            token1: pool.token1,  // Full token1 data
                            totalValueLockedToken0: pool.totalValueLockedToken0,
                            totalValueLockedToken1: pool.totalValueLockedToken1,
                            totalValueLocked: tvl,  // Store TVL for sorting
                            volumeToken0: pool.volumeToken0,
                            volumeToken1: pool.volumeToken1
                        });
                        seenIds.add(pool.id);
                    }
                }
            }
        }
    }

    // Sort by totalValueLocked in descending order (highest to lowest)
    return tvlTokens.sort((a, b) => b.totalValueLocked - a.totalValueLocked);
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
            <TableHeader> Info </TableHeader>
          </tr>
        </thead>
        <tbody>
          {!highestPriceTokensOut?.length ? (
            <TableBodyRow style={{ height: "56px"}} />
          ) : 
          (
            highestPriceTokensOut?.map((item) => {
              return (
                <TableBodyRow key={item.id} onClick={() => window.location.href=`/${item.token0.symbol != "WPEPU" ? item.token0.id : item.token1.id}`}>
                    <TableBody width={23} style={{ display: "flex", alignItems: "center", width: "100%" }}>
                      <StyledImage src={item?.iconUrl} />
                      <p style={{ paddingLeft: "10px" }}>{
                        item.token0.symbol != "WPEPU" ? item.token0.name : item.token1.name
                      }</p>
                    </TableBody>
                    <TableBody width={23}>
                      {item.marketCap && (
                        <>
                          ${commaizeNumber(
                            formatDecimals(
                              Math.abs(item.marketCap),
                              2
                            )
                          )}
                        </>
                      )}
                      {(!item.hasOwnProperty("marketCap")) && (
                        <LoadingLottie width={18} />
                      )}
                    </TableBody>

                    <TableBody width={23}>
                      {item.volume && (
                        <>
                          ${commaizeNumber(
                            formatDecimals(
                              Math.abs(item.volume),
                              2
                            )
                          )}
                        </>
                      )}
                      {(!item.hasOwnProperty("volume")) && (
                        <LoadingLottie width={18} />
                      )}
                    </TableBody>

                    <TableBody width={23}>
                      {item.xChange && (
                        <>
                          {commaizeNumber(
                            formatDecimals(
                              (item.xChange/100),
                              2
                            )
                          )}x
                        </>
                      )}
                      {(!item.hasOwnProperty("xChange")) && (
                        <LoadingLottie width={18} />
                      )}
                    </TableBody>

                    <TableBody width={8}>
                      <a
                        href={`/${
                          item.token0.symbol != "WPEPU" ? item.token0.id : item.token1.id
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

const StyledImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid #272727;
  object-fit: cover;
`;