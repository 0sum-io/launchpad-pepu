import { Flex, Spacing, UrlLottie, useCheckIsMobile } from "@boxfoxs/bds-web";
import { Path } from "@boxfoxs/next";
import styled from "@emotion/styled";
import { FadeAnimation } from "components/animation";
import { PageContainer } from "components/PageContainer";
import { usePresale, usePresaleByRPC } from "containers/launchpad/hooks";
import { Chart } from "./components/Chart";
import { InfoSection } from "./components/Info";
import { StatisticsSection } from "./components/statistics";
import { DeployedDexBadge, SummarySection } from "./components/summary";
import { TradeCard } from "./components/summary/TradeCard";
import { EVMChainId } from "models/ChainId";
import { DefinedChart } from "./components/DefinedChart";
import { useBondingCurveProgress } from "containers/launchpad/hooks/useBondingCurveProgress";

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
          <Spacing height={isMobile ? 56 : 104} />
          <Flex.CenterVertical
            align="start"
            direction={isMobile ? "column" : "row"}
          >
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
