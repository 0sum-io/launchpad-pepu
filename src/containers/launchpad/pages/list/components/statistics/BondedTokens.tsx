import { inDesktop, Spacing } from "@boxfoxs/bds-web";
import { isMobile } from "@boxfoxs/next";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { parseEther } from "@ethersproject/units";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { LoadingLottie } from "components/lotties/LoadingLottie";
import { ethers } from "ethers";
import { fetchQuote } from "hooks/on-chain/useDexPrice";
import { useEffect, useState } from "react";
import { formatDecimals} from "utils/format";
import { getV3BondedPrice } from "utils/getV3BondedPrice";
import { pressableStyle } from "utils/style";

const BLACKLIST_TOKENS = ["0x33c2643b968cf7ada40e26ad0d884b6e9aaf76c3"];

const BondedTokens = () => {
  let [dexPrice, setDexPrice] = useState(0);
  let [paginationPageNumber, setPaginationPageNumber] = useState(0);
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
    fetchPoolWithHighestPrice();
  }, [paginationPageNumber]);

  // fetch pool with highest token price in WPEPU
  const fetchPoolWithHighestPrice = async () => {
    setLoadingNewPage(true);

    const query = `
        query GetHighestPriceToken {
          presales (
            where: { isEnd: true },
            first: 50, skip: ${paginationPageNumber * 49}
          ) {
            name
            data
            token
            isEnd
            totalSupply
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

    // Every token tokenDataJson.data.presales have data atribute that needs to be JSON.parse
    highestPriceTokenJson.data.presales.forEach((presale) => {
      presale.data = JSON.parse(presale.data);
    });

    // Match same token with presale data and put 'data' from presale to token and
    // calculate token performance naming it "xChange" using initialMarketCap and marketCap
    for (let token of highestPriceTokenJson.data.presales) {
      // Wait for token price to be fetched from DEX
      let tokenPrice;
      // Check what token is NOT WPEPU and set tokenPrice
      tokenPrice = await fetchDexPrice(token.token);
      tokenPrice = ethers.utils.formatEther(tokenPrice);

      const totalTokenSupply = ethers.utils.formatEther(token.totalSupply);

      token['iconUrl'] = token.data.iconUrl;
      token['description'] = token.data.description;

      // Set initial market cap that is totalValueLocked * dexPrice
      token['initialMarketCap'] = 1200;
      token['marketCap'] = parseFloat(totalTokenSupply) * tokenPrice * dexPrice;
    }

    // Check if token0 or token1 is WPEPU and after that set "volume" attribute from volumeToken0 or volumeToken1 that corresponds to WPEPU
    // and calculate token performance naming it "xChange" using initialMarketCap and marketCap
    for (let token of highestPriceTokenJson.data.presales) {
      token['xChange'] = ((token.marketCap - token.initialMarketCap) / token.initialMarketCap) * 100;
    }

    // Sort by marketCap
    highestPriceTokenJson.data.presales.sort((a, b) => b.marketCap - a.marketCap);

    console.log("highestTVLTokens 24H list >>>>>>>>", highestPriceTokenJson.data.presales);

    // filter out tokens that are not in the list
    const whitelistedTokens = highestPriceTokenJson.data.presales.filter((token) => !BLACKLIST_TOKENS.includes(token.token));

    setHighestPriceTokensOut(whitelistedTokens);
    setLoadingNewPage(false);
  };

  const fetchDexPrice = async (address) => {
    const bondedPrice = getV3BondedPrice(address);
    return bondedPrice;
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
                {/* <TableHeader> 24h Volume </TableHeader> */}
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
                    <TableBodyRow key={item.id}>
                        <TableBody width={30} style={{ display: "flex", alignItems: "center", width: "100%" }}>
                          <StyledImage src={item?.iconUrl} />
                          <p style={{ paddingLeft: "10px" }}>{
                            item.name
                          }</p>
                        </TableBody>
                        <TableBody width={30}>
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
    
                        {/* <TableBody width={23}>
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
                        </TableBody> */}
    
                        <TableBody width={30}>
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
    
                        <TableBody width={10}>
                          <a
                            href={`/${
                              item.token
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
          if (paginationNmbr > 0) {
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
        <span style={{ fontSize: "18px", color: "#fff", margin: "0 50px" }}> {  1 + paginationPageNumber } </span>

        {highestPriceTokensOut.length > 49 ? 
          <ScrollButtonPagination onClick={() => {
              let paginationNmbr = paginationPageNumber + 1;
              setPaginationPageNumber(paginationNmbr);
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
        : <></>}
      </div>
    </div>
  );
}

export default BondedTokens;

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