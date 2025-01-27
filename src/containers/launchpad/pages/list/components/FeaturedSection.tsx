import { Flex, inDesktop, Spacing } from "@boxfoxs/bds-web";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { formatDecimals } from "utils/format";
import { ConnectButton } from "components/Button";
import { useRouter } from "next/router";
import { useCheckIsMobile } from "@boxfoxs/bds-web";
import { useCreatePresaleState } from "../../create/hooks/useCreateStore";
import dynamic from 'next/dynamic';
import { fetchQuote } from "hooks/on-chain/useDexPrice";
import { formatUnits } from "@ethersproject/units";

const WalletControlLazy = dynamic(() => import('../../../../../components/header/WalletControl'), {
  loading: () => <p>Loading...</p>, // Optional fallback while loading
});

const FeaturedSection = () => {
  const [data, setFeaturedData] = useState(undefined);

  const router = useRouter();
  const isMobile = useCheckIsMobile();
  const form = useCreatePresaleState();

  const [dexPrice, setDexPrice] = useState(0);

  useEffect(() => {
    const fetchDexPrice = async () => {
      const price = await fetchQuote();
      setDexPrice(parseFloat(price));
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
          pools(orderBy: token0Price, orderDirection: desc) {
            id
            volumeToken0
            volumeToken1
            token0Price
            token1Price
            token1 {
              id
              name
              symbol
            }
            token0 {
              id
              name
              symbol
            }
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

    // Find the first record where token0 is not "WPEPU"
    const highestValueToken = highestPriceTokenJson.data.pools.find(pool => pool.token0.symbol !== "WPEPU");

    // Calculate the price of token0 in WPEPU/token0 and with 18 decimals
    highestValueToken['price'] = formatUnits(parseInt(highestValueToken.token0Price), 18);
    // Calculate the price in USD
    highestValueToken['priceInUSD'] = highestValueToken['price'] * dexPrice;
    // Calculate current market cap (supply is 1B)
    highestValueToken['marketCap'] = 10000000 * highestValueToken['priceInUSD'];
    // Calculate percentage change (current market cap / initial market cap * 100)
    highestValueToken['percentageChange'] = ((10000000 * highestValueToken['priceInUSD']) / 150) * 100;

    // console.log("highestPriceTokenJson ----> ", highestValueToken);

    // We need iconUrl and description from presale data
    fetchPresale(highestValueToken);
  };

  // fetch one presale data from graphql
  const fetchPresale = async (tokenObject: any) => {
      const query = `
        query GetTokenData {
          presales(where: { id: "${tokenObject.id}" }) {
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

    // console.log("tokenDataJson ----> ", tokenDataJson);
    // Parse the data and set the featured data
    tokenDataJson.data.presales[0].data = JSON.parse(tokenDataJson.data.presales[0].data);

    setFeaturedData({
      id: tokenObject.token0.id,
      name: tokenObject.token0.name,
      symbol: tokenObject.token0.symbol,
      marketCap: tokenObject.marketCap,
      initial_wpepu_price: 0.00001,
      initial_market_cap: 150,
      priceInWpepu: tokenObject.price,
      priceInUSD: tokenObject.priceInUSD,
      percentageChange: tokenObject.percentageChange,
      data: {
        iconUrl: tokenDataJson?.data?.presales[0].data?.iconUrl,
        description: tokenDataJson?.data?.presales[0].data?.description,
      },
    });
  };

  return (
    data && (
        <Container>

          <div style={isMobile ? 
            { display: "flex", justifyContent: "space-between", flexDirection: "column", alignItems: "center" } : 
            { display: "flex", justifyContent: "space-between" }}>
            
            <WalletControlLazy left={isMobile ? "0px" : "-100px"} />

            <div style={{ width: "50%" }}>
            <Featured style={isMobile ? {marginTop: "30px"} : {marginTop: "0px"}}>FEATURED</Featured>
              <a href={data?.id}>
                <Flex.CenterHorizontal style={{ zIndex: "1" }}>
                  <StyledImage src={data?.data.iconUrl} />
                  <Spacing width={32} />

                  <div style={{ flex: 1 }}>
                    <Spacing height={6} />
                    <Title>
                      {data?.name} ({data?.symbol})
                    </Title>
                    <Spacing height={12} />

                    <SubContainer>
                      <Amount>
                        ${`${commaizeNumber(
                          formatDecimals(data.marketCap, 2)
                          )
                        }`}
                      </Amount>
                      <Content style={{ paddingLeft: '10px', color: '#FFF' }}>MARKET CAP</Content>
                    </SubContainer>

                    <Content style={{ color: '#2eb335', fontWeight: '700', height: '30px' }}>
                      +{`${commaizeNumber(
                        formatDecimals(data.percentageChange, 2)
                        )
                      }`}%
                    </Content>
                    <LiveNowContainer>
                      <div className="live-dot"></div>
                      <span style={{ paddingTop: '2px' }}>LIVE NOW</span>
                    </LiveNowContainer>

                    {/* <Content>{data?.data.description}</Content>
                    <Spacing height={20} /> */}

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

const SubContainer = styled.div`
  display: flex;
  align-items: baseline;
  font-weight: 700;
  height: 50px;
  // -webkit-text-stroke: 1px black;
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

const Amount = styled.div`
  color: #fff;
  font-size: 17px;
  ${inDesktop(`
    font-size: 44px;
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