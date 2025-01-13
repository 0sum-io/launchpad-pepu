import { Flex, inDesktop, Spacing } from "@boxfoxs/bds-web";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { formatDecimals } from "utils/format";
import { usePresaleList } from "../../../hooks/usePresaleList";
import { usePools } from "../../../hooks/usePools";
import { addressIsSame } from "utils/addressIsSame";
import { ConnectButton } from "components/Button";
import { useRouter } from "next/router";
import { useCheckIsMobile } from "@boxfoxs/bds-web";
import { useCreatePresaleState } from "../../create/hooks/useCreateStore";
// import { WalletControl } from "components/header/WalletControl";
import dynamic from 'next/dynamic';

const WalletControlLazy = dynamic(() => import('../../../../../components/header/WalletControl'), {
  loading: () => <p>Loading...</p>, // Optional fallback while loading
});

export function FeaturedSection() {
  const [data, setData] = useState(undefined);
  const presaleList = usePresaleList();
  const pools = usePools();

  const router = useRouter();
  const isMobile = useCheckIsMobile();
  const form = useCreatePresaleState();

  // console.log("FeaturedSection", data, presaleList, pools);

  useEffect(() => {
    if (!presaleList.data || !pools.data) return;

    // derive market cap from pools and presales
    const withMC = presaleList.data.map((i) => {
      const data = pools.data.find((v) => addressIsSame(v.id, i.pairAddress));
      const mc = addressIsSame(data.token0.id, i.token)
        ? data.volumeToken1
        : data.volumeToken0;
      return { ...i, mc };
    });
    // fetch last swap data
    fetchData(withMC);

    const interval = setInterval(() => {
      console.log("fetching data");
      fetchData(withMC);
    }, 5000);

    return () => clearInterval(interval);
  }, [presaleList.data, pools.data]);

  // fetch data from graphql
  const fetchData = async (withMC) => {
    const query = `
        query LastSwap {
          swaps(first: 1, orderBy: timestamp, orderDirection: desc) {
            token0 {
              name
              id
              volume
              symbol
            }
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

    const presale = withMC.find(
      (i) => i.token === json.data.swaps[0].token0.id
    );

    setData({
      id: json.data.swaps[0].token0.id,
      name: json.data.swaps[0].token0.name,
      symbol: json.data.swaps[0].token0.symbol,
      marketCap: presale.mc,
      data: {
        iconUrl: presale.data.iconUrl,
        description: presale.data.description,
      },
    });
  };

  return (
    data && (
        <Container className="FeaturedSection">

          <div style={isMobile ? 
            { display: "flex", justifyContent: "space-between", flexDirection: "column", alignItems: "center" } : 
            { display: "flex", justifyContent: "space-between" }}>
            
            <WalletControlLazy left={isMobile ? "0px" : "-100px"} />

            <div>
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
                      {/* <Amount>
                        {`${commaizeNumber(Number(formatDecimals(data.marketCap, 6)))}`}
                        {` ${process.env.NEXT_PUBLIC_CHAIN_SYMBOL}`}
                      </Amount> */}
                      <Amount>
                        $1,837,344.22
                      </Amount>
                      <Content style={{ paddingLeft: '10px', color: '#FFF' }}>MARKET CAP</Content>
                    </SubContainer>

                    <Content style={{ color: '#2eb335', fontWeight: '700', height: '30px' }}>+$866,308.32 (2,801.22%)</Content>
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
}

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
  gap: 8px; /* Space between dot and text */
  font-size: 16px;
  font-weight: bold;
  color: #2eb335; /* Bright green color */
  background-color: transparent;

  .live-dot {
    width: 15px;
    height: 15px;
    background-color: #00ff00; /* Bright green dot */
    border-radius: 50%; /* Make it a circle */
    box-shadow: 0 0 8px rgba(0, 255, 0, 0.8); /* Glowing effect */
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 8px rgba(0, 255, 0, 0.8); /* Subtle glow */
    }
    50% {
      transform: scale(1.5); /* Scale up the dot */
      box-shadow: 0 0 20px rgba(0, 255, 0, 1); /* Bright glowing background */
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 8px rgba(0, 255, 0, 0.8); /* Return to subtle glow */
    }
  }
`;