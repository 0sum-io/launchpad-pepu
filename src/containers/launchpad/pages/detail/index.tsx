import { Flex, Spacing, UrlLottie, useCheckIsMobile } from "@boxfoxs/bds-web";
import { Path } from "@boxfoxs/next";
import styled from "@emotion/styled";
import { FadeAnimation } from "components/animation";
import { PageContainer } from "components/PageContainer";
import { usePresale, usePresaleByRPC } from "containers/launchpad/hooks";
import { Chart } from "./components/Chart";
import { InfoSection } from "./components/Info";
import { DeployedDexBadge } from "./components/summary";
import { EVMChainId } from "models/ChainId";
import { DefinedChart } from "./components/DefinedChart";
import { useBondingCurveProgress } from "containers/launchpad/hooks/useBondingCurveProgress";
// import { WalletControl } from "components/header/WalletControl";
import dynamic from 'next/dynamic';

const WalletControlLazy = dynamic(() => import('../../../../components/header/WalletControl'), {
  loading: () => <p>Loading...</p>, // Optional fallback while loading
});

const TradeCard = dynamic(() => import('./components/summary/TradeCard'), {
  loading: () => <p>Loading...</p>, // Optional fallback while loading
});

const SummarySection = dynamic(() => import('./components/summary/Summary'), {
  loading: () => <p>Loading...</p>, // Optional fallback while loading
});

const StatisticsSection = dynamic(() => import('./components/statistics/Statistics'), {
  loading: () => <p>Loading...</p>, // Optional fallback while loading
});

export default function DetailPage() {
  const isMobile = useCheckIsMobile();
  const id = Path.get("id");
  const presale = usePresaleByRPC(id);
  const progress = useBondingCurveProgress(presale);

  if (!presale) {
    return (
      <PageContainer>
        <Spacing height="40vh" />
        <UrlLottie
          src="/lotties/loading.json"
          style={{ width: "40px", height: "40px" }}
          options={{ loop: true }}
        />
      </PageContainer>
    );
  }
  return (
    <PageContainer>
      <FadeAnimation>
        <ContentContainer>

          <Spacing height={isMobile ? 25 : 35} />
          <Flex.CenterVertical
            align="start"
            direction={isMobile ? "column" : "row"}
          >
            <div>
              <WalletControlLazy left="0px" />
            </div>
            <Spacing width={28} />

            <div style={{ flex: 1 }}>
              <InfoSection presale={presale} />
              <Spacing height={isMobile ? 28 : 32} />

              {[EVMChainId.CHAIN, EVMChainId.CHAIN].includes(
                presale.chainId
              ) ? (
                <Chart presale={presale} />
              ) : (
                <DefinedChart data={presale} />
              )}
            </div>

            <Spacing width={28} height={28} />
            
            <div style={{ flex: 1, maxWidth: "400px", width: "100%" }}>
              <SummarySection presale={presale} />
              <Spacing height={24} />
              {progress.data === 100 ? (
                <DeployedDexBadge data={presale} />
              ) : (
                <TradeCard presale={presale} />
              )}
            </div>
          </Flex.CenterVertical>

          <Spacing height={40} />
          <StatisticsSection presale={presale} />
          <Spacing height={isMobile ? 64 : 134} />

        </ContentContainer>
      </FadeAnimation>
    </PageContainer>
  );
}

const ContentContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
`;
