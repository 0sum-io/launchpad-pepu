import { Flex, inDesktop, Spacing } from "@boxfoxs/bds-web";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { formatDecimals } from "utils/format";
import { hoverableStyle, pressableStyle } from "utils/style";
import { usePresaleList } from "../../../hooks/usePresaleList";
import { usePools } from "../../../hooks/usePools";
import { addressIsSame } from "utils/addressIsSame";

export function FeaturedSection() {
  const [data, setData] = useState(undefined);
  const presaleList = usePresaleList();
  const pools = usePools();

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
      <a href={data?.id}>
        <Container className="FeaturedSection">
          <Featured>FEATURED</Featured>
          <Flex.CenterHorizontal>
            <StyledImage src={data?.data.iconUrl} />
            <Spacing width={32} />
            <div style={{ flex: 1 }}>
              <Spacing height={6} />
              <Title>
                {data?.name} ({data?.symbol})
              </Title>
              <Content>{data?.data.description}</Content>
              <Spacing height={20} />
              <Amount>
                {`${commaizeNumber(Number(formatDecimals(data.marketCap, 6)))}`}
                {` ${process.env.NEXT_PUBLIC_CHAIN_SYMBOL}`}
              </Amount>
              <Content>MARKET CAP</Content>
            </div>
          </Flex.CenterHorizontal>
        </Container>
      </a>
    )
  );
}

const Container = styled.div`
  max-width: 950px;
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 32px;
  border: 4px solid #272727;
  box-shadow: rgb(0, 0, 0) 4px 4px;
  background: rgb(48, 104, 185);
  backdrop-filter: blur(30px);
  cursor: pointer;
  ${hoverableStyle.scale(1.02)}
  ${pressableStyle.scale()}
  ${inDesktop(`
    padding: 24px;
  `)}
`;

const Featured = styled.div`
  color: #fff;
  font-size: 24px;
  weight: 700;
`;

const StyledImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 6px;
  object-fit: cover;
  ${inDesktop(`
    width: 204px;
    height: 204px;
  `)}
`;

const Title = styled.h3`
  color: #fff;
  font-weight: 700;
  font-size: 17px;
  ${inDesktop(`
    font-size: 32px;
  `)}
`;

const Content = styled.div`
  height: 34px;
  word-break: break-all;
  color: #d5ded7;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  ${inDesktop(`
    font-size: 14px;
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
