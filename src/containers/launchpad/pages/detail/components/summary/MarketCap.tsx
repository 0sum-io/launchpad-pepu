import { Flex, inDesktop, Spacing, Text, useCheckIsMobile } from "@boxfoxs/bds-web";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import {
  usePresaleByRPC,
} from "containers/launchpad/hooks";
import { formatDecimals } from "utils/format";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { useEffect, useState } from "react";
import { fetchQuote } from "hooks/on-chain/useDexPrice";

const MarketCap = ({ presale }: { presale: ParsedPresale }) => {
  // console.log("Best Preforming Presale Token: ", presale);
  const presaleData = usePresaleByRPC(presale.token);
  const isMobile = useCheckIsMobile();

  // Quote for token and real market cap
  const [marketCap, setMarketCap] = useState<number | null>(null);
  const [dexPrice, setDexPrice] = useState(0);

  // Calculate token performance
  const [tokenPerformance, setTokenPerformance] = useState<number | null>(null);

  // Check PEPU price
  useEffect(() => {
    const fetchDexPrice = async () => {
      const price = await fetchQuote();
      setDexPrice(parseFloat(price));
    };
    fetchDexPrice();
  }, []);

  // Calculate market cap after knowing TVL and PEPU price
  useEffect(() => {
    if (dexPrice) {
      // Market cap is presale['tvlInWPEPU'] * dexPrice
      const marketCap = presale['tvlInWPEPU'] * dexPrice;
      setMarketCap(marketCap);
    }
  }, [dexPrice]);

  // Calculate initial market cap and token performance
  useEffect(() => {
    if (dexPrice) {
      // Initial Market cap is initial quote * dexPrice
      const initialMarketCap = 50 * dexPrice;

      // Token performance is market cap / initial market cap * 100
      const tokenPerformance = (marketCap / initialMarketCap) * 100;
      setTokenPerformance(tokenPerformance);
    }
  }, [dexPrice, marketCap]);

  if (presaleData) {
    return (
      <>
        <Container>
          <Flex.CenterVertical style={{ alignItems: "baseline", height: "54px" }}>
            <Amount>
              ${`${commaizeNumber(
                formatDecimals(marketCap, 2)
                )
              }`}
            </Amount>

            {
              isMobile && (
                <Content style={{ paddingLeft: '10px', color: '#FFF' }}> MC </Content>
              )
            }
            {
              !isMobile && (
                <Content style={{ paddingLeft: '10px', color: '#FFF' }}> MARKET CAP </Content>
              )
            }

            {/* {quote.isLoading ? (
              <LoadingLottie width={24} />
            ) : (
              <Text
                style={{ fontSize: isMobile ? "15px" : "17px", fontWeight: 600 }}
                color="#fff"
              >
                {quote.data
                  ? commaizeNumber(Number(formatDecimals(quote.data, 18)))
                  : "-"}
              </Text>
            )} */}
          </Flex.CenterVertical>
        </Container>

        <Content style={{ color: '#2eb335', fontWeight: '700', height: '35px' }}>
          +{`${commaizeNumber(
            formatDecimals(tokenPerformance, 2)
            )
          }`}%
        </Content>
      </>
    );
  }
};

export default MarketCap;

const Container = styled.div`
  display: flex;
  align-items: baseline;
  font-weight: 700;
`;

const TokenIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: #272727;
  object-fit: cover;
  object-position: center;
`;

const Txt = styled.div`
  color: #fff;
  font-family: Grandstander;
`;

const Amount = styled.div`
  color: #fff;
  font-size: 17px;
  ${inDesktop(`
    font-size: 44px;
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
    height: 44px;
    -webkit-line-clamp: 3;
  `)}
`;