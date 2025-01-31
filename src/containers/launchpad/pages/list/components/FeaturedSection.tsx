import { Flex, inDesktop, Spacing } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { ConnectButton } from "components/Button";
import { useRouter } from "next/router";
import { useCheckIsMobile } from "@boxfoxs/bds-web";
import { useCreatePresaleState } from "../../create/hooks/useCreateStore";
import dynamic from 'next/dynamic';
import { fetchQuote } from "hooks/on-chain/useDexPrice";
import { formatUnits } from "@ethersproject/units";
import MarketCap from "../../detail/components/summary/MarketCap";

const WalletControlLazy = dynamic(() => import('../../../../../components/header/WalletControl'), {
  loading: () => <p>Loading...</p>, // Optional fallback while loading
});

const FeaturedSection = () => {
  const [data, setFeaturedData] = useState(undefined);
  const [initialMC, setInitialMarketCap] = useState(0);

  const router = useRouter();
  const isMobile = useCheckIsMobile();
  const form = useCreatePresaleState();

  const [dexPrice, setDexPrice] = useState(0);
  const [highestValueToken, setHighestValueToken] = useState(null);

  useEffect(() => {
    const fetchDexPrice = async () => {
      const price = await fetchQuote();
      setDexPrice(parseFloat(price));

      // Now we can calculate inital market cap
      // PEPU price * token worth in PEPU * total supply
      const initialMarketCap = parseFloat(price) * 0.0001 * 1000000000;
      setInitialMarketCap(initialMarketCap);
    };
    fetchDexPrice();
  }, []);

  useEffect(() => {

    if (dexPrice === 0) return;
    fetchPoolWithHighestPrice();

    // We are setting fetch for presale list here
    const interval = setInterval(() => {
      fetchPoolWithHighestPrice();
    }, 15000);

    return () => clearInterval(interval);
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
    // console.log("filteredData >>>>>>>>", filteredData);

    // Now find the highest volume token from filtered data
    const highestTVLToken = findHighestTVLToken(filteredData);
    // console.log("highestTVLToken >>>>>>>>", highestTVLToken);

    // We need iconUrl and description from presale data
    fetchPresale(highestTVLToken);
  };

  // fetch one presale data from graphql
  const fetchPresale = async (tokenObject: any) => {
      const query = `
        query GetTokenData {
          presales(where: { id: "${tokenObject.id}", isEnd: false }) {
            id
            data
            name
            pairAddress
            paymentToken
            presaleAmount
            saleAmount
            symbol
            token
            totalSupply
            transactionHash
            blockTimestamp
            blockNumber
            minter
          }
        }
    `;

    const tokenDataJson = await fetch(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());

    // Parse the data and set the featured data
    tokenDataJson.data.presales[0].data = JSON.parse(tokenDataJson.data.presales[0].data);
    setHighestValueToken(tokenDataJson.data.presales[0]);
    // console.log("tokenDataJson >>>>>>>>", tokenDataJson);

    setFeaturedData({
      id: tokenDataJson.data.presales[0].token,
      name: tokenDataJson.data.presales[0].name,
      symbol: tokenDataJson.data.presales[0].symbol,
      initial_market_cap: initialMC,
      marketCap: tokenObject.marketCap,
      initial_wpepu_price: 0.0001,
      priceInWpepu: tokenObject.price,
      priceInUSD: tokenObject.priceInUSD,
      percentageChange: tokenObject.percentageChange,
      data: {
        iconUrl: tokenDataJson?.data?.presales[0].data?.iconUrl,
        description: tokenDataJson?.data?.presales[0].data?.description,
      },
    });
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

  function findHighestTVLToken(data, tokenSymbol = "WPEPU") {
    let highestTVLToken = null;
    let highestTVL = 0;
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

                    // Ensure the pool ID is unique and has the highest TVL
                    if (tvl > highestTVL && !seenIds.has(pool.id)) {
                        highestTVL = tvl;
                        highestTVLToken = {
                            id: pool.id,
                            token0: pool.token0,  // Full token0 data
                            token1: pool.token1,  // Full token1 data
                            totalValueLockedToken0: pool.totalValueLockedToken0,
                            totalValueLockedToken1: pool.totalValueLockedToken1
                        };
                        seenIds.add(pool.id); // Avoid duplicate results
                    }
                }
            }
        }
    }

    return highestTVLToken;
  };

  return (
    data && (
        <Container>

          <div style={isMobile ? 
            { display: "flex", justifyContent: "space-between", flexDirection: "column", alignItems: "center" } : 
            { display: "flex", justifyContent: "space-between" }}>
            
            <WalletControlLazy left={isMobile ? "0px" : "-100px"} />

            <div style={{ width: isMobile ? "80%" : "50%" }}>
            <Featured style={isMobile ? {marginTop: "30px"} : {marginTop: "0px"}}>FEATURED</Featured>
              <a href={data?.id}>
                <Flex.CenterHorizontal style={{ zIndex: 1 }}>
                  <StyledImage src={data?.data.iconUrl} />
                  <Spacing width={32} />

                  <div style={{ flex: 1 }}>
                    <Spacing height={6} />
                    <Title>
                      {data?.name} ({data?.symbol})
                    </Title>
                    <Spacing height={12} />

                    {
                      highestValueToken && (
                        <MarketCap presale={highestValueToken} />
                      )
                    }
                    <LiveNowContainer>
                      <div className="live-dot"></div>
                      <span style={{ paddingTop: '2px' }}>LIVE NOW</span>
                    </LiveNowContainer>

                  </div>
                </Flex.CenterHorizontal>
              </a>
            </div>

            <ConnectButton style={isMobile ? {marginTop: "30px", zIndex: "10", color: "#000"} : {marginTop: "0px", zIndex: "10", color: "#000"}}
                onClick={() => {
                  form.clear();
                  router.push("/create");
                }}
                theme="primary"
                rounded={isMobile ? 16 : 20}
                padding={isMobile ? "16px 0" : "20px 28px"}
                fullWidth={isMobile}
                textSize={isMobile ? 15 : 20}
                bold={600}
              >
              Create Token
            </ConnectButton>
          </div>

          <Spacing height={32} />

        </Container>
    )
  );
};

export default FeaturedSection;

const Container = styled.div`
  z-index: 1;
  cursor: pointer;
  ${inDesktop(`
    z-index: 1;
    padding: 24px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    top: 30px;
  `)}
`;

const Featured = styled.div`
  color: #fff;
  font-size: 24px;
  font-weight: 700;
`;

const StyledImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 2px solid #272727;
  object-fit: cover;
  ${inDesktop(`
    width: 204px;
    height: 204px;
  `)}
`;

const Title = styled.h3`
  color: #2eb335;
  font-weight: 700;
  font-size: 36px;
  -webkit-text-stroke: 1px black;
  ${inDesktop(`
    font-size: 36px;
  `)}
`;

const Content = styled.div`
  height: 34px;
  word-break: break-all;
  color: #d5ded7;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  ${inDesktop(`
    font-size: 16px;
    height: 60px;
    -webkit-line-clamp: 3;
  `)}
`;

const LiveNowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #2eb335;
  background-color: transparent;

  .live-dot {
    width: 15px;
    height: 15px;
    background-color: #00ff00;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(0, 255, 0, 0.8);
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 8px rgba(0, 255, 0, 0.8);
    }
    50% {
      transform: scale(1.5);
      box-shadow: 0 0 20px rgba(0, 255, 0, 1);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 8px rgba(0, 255, 0, 0.8);
    }
  }
`;