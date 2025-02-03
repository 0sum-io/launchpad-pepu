import { inDesktop, Spacing } from "@boxfoxs/bds-web";
import { isMobile } from "@boxfoxs/next";
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
  let [paginationPageNumber, setPaginationPageNumber] = useState(1);
  let [loadingNewPage, setLoadingNewPage] = useState(true);

  // Quoter params
  const [highestPriceTokensOut, setHighestPriceTokensOut] = useState([]);

  // Check PEPU price and set initial market cap
  useEffect(() => {
    const fetchDexPrice = async () => {
      const price = await fetchQuote();
      setDexPrice(parseFloat(price));
    };
    fetchDexPrice();
  }, []);

  // Fetch highest price pool
  useEffect(() => {
    if (dexPrice === 0) return;
    fetchPoolWithHighestPrice();
  }, [dexPrice]);

  // Fetch highest price pool on pagination change
  useEffect(() => {
    console.log("paginationPageNumber", paginationPageNumber);
    fetchPoolWithHighestPrice();
  }, [paginationPageNumber]);

  // fetch pool with highest token price in WPEPU
  const fetchPoolWithHighestPrice = async () => {
    setLoadingNewPage(true);

    const query = `
        query GetHighestPriceToken {
          poolsByToken0Volume: pools(orderBy: totalValueLockedToken0, orderDirection: desc, first: 10, skip: ${paginationPageNumber}
            where: { token0_: { id: "${process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY}" } }
          ) {
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
          poolsByToken1Volume: pools(orderBy: totalValueLockedToken1, orderDirection: desc, first: 10, skip: ${paginationPageNumber}
            where: { token1_: { id: "${process.env.NEXT_PUBLIC_WRAPPED_NATIVE_CURRENCY}" } }
          ) {
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
        }
    `;

    const highestPriceTokenJson = await fetch(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());

    const highestTVLTokens = findAllTVLTokensSorted(highestPriceTokenJson.data);
    console.log("highestTVLTokens 24H list >>>>>>>>", highestTVLTokens);

    // Fetch presale data for highestTVLTokens
    const tokenDatas = await fetchPresales(highestTVLTokens);
    // console.log("tokenDatas >>>>>>>>", tokenDatas);

    // Match same token with presale data and put 'data' from presale to token
    for (let token of highestTVLTokens) {
      const tokenData = tokenDatas.find((t) => t.id === token.id);
      if (tokenData) {
        token['iconUrl'] = tokenData.data.iconUrl;
        token['description'] = tokenData.data.description;

        // Set initial market cap that is totalValueLocked * dexPrice
        token['initialMarketCap'] = 50 * dexPrice;
        token['marketCap'] = token.totalValueLocked * dexPrice;
      }
    }

    // Check if token0 or token1 is WPEPU and after that set "volume" attribute from volumeToken0 or volumeToken1 that corresponds to WPEPU
    // and calculate token performance naming it "xChange" using initialMarketCap and marketCap
    for (let token of highestTVLTokens) {
      if (token.token0.symbol === "WPEPU") {
        token['volume'] = parseFloat(token.volumeToken0) * dexPrice;
        if (token.totalValueLocked === 0) {
          token['xChange'] = 0;
        } else {
          token['xChange'] = ((token.marketCap - token.initialMarketCap) / token.initialMarketCap) * 100;
        }
      } else {
        token['volume'] = parseFloat(token.volumeToken1) * dexPrice;
        if (token.totalValueLocked === 0) {
          token['xChange'] = 0;
        } else {
          token['xChange'] = ((token.marketCap - token.initialMarketCap) / token.initialMarketCap) * 100;
        }
      }
    }

    // console.log("highestTVLTokens 24H list >>>>>>>>", highestTVLTokens);
    setHighestPriceTokensOut(highestTVLTokens);
    // We need iconUrl and description from presale data
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

    // Loading is completed
    setLoadingNewPage(false);

    return tokensDataJson.data.presales;
  };

  return (
    <div>
      {
        !loadingNewPage && (
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
                                  Math.abs(item.totalValueLocked * dexPrice),
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
        )
      }

      {
        loadingNewPage && (
          <>
            <Spacing height={28} />
            <LoadingLottie width={36} />
            <Spacing height={28} />
          </>
        )
      }

      <Spacing height={8} />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ScrollButtonPagination onClick={() => {
          let paginationNmbr = paginationPageNumber;
          if (paginationNmbr > 1) {
            paginationNmbr = paginationNmbr - 1;
            setPaginationPageNumber(paginationNmbr)
          }
        }}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "rotateY(180deg)" }}>
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ScrollButtonPagination>

        <span style={{ fontSize: "18px", color: "#fff", margin: "0 50px" }}> { paginationPageNumber } </span>

        <ScrollButtonPagination onClick={() => {
            let paginationNmbr = paginationPageNumber + 1;
            setPaginationPageNumber(paginationNmbr)
          }}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ScrollButtonPagination>
      </div>
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

const ScrollButtonPagination = styled.button`
  width: 30px;
  height: 30px;
  background-color: #00b300; /* Green background */
  color: #fff; /* White arrow color */
  border: 2px solid #000;
  border-radius: 50%; /* Circle shape */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #009900; /* Darker green on hover */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Enhanced shadow on hover */
  }

  &:active {
    background-color: #006600; /* Even darker green on click */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Reduced shadow on click */
  }

  svg {
    width: 44px;
    height: 44px;
    color: #000;
  }

  ${inDesktop(`
    top: 50%;
  `)}
`;