import { Flex, inDesktop, Spacing, useCheckIsMobile } from "@boxfoxs/bds-web";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { formatEther } from "@ethersproject/units";
import { ProgressBar } from "components/ProgressBar";
import { chains } from "constants/chains";
import {
  useBondingCurveProgress,
  useRaisedAmount,
} from "containers/launchpad/hooks/useBondingCurveProgress";
import { useTokenInfo } from "hooks/on-chain";
import { useRouter } from "next/router";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { getClearedSymbol } from "utils/checkIsNative";
import { formatDecimals } from "utils/format";
import { hoverableStyle, pressableStyle } from "utils/style";

const SaleCard = ({ data }: { data: ParsedPresale }) => {
  const isMobile = useCheckIsMobile();
  const router = useRouter();
  const progress = useBondingCurveProgress(data);
  const raisedAmount = useRaisedAmount(data);
  const paymentToken = useTokenInfo(data.chainId, data.paymentToken);

  return (
    <Container>
      <Flex.CenterHorizontal>
        <StyledImage src={data.data.iconUrl} />
        <Spacing width={isMobile ? 16 : 20} />

        <div style={{ flex: 1 }}>
          <Spacing height={6} />

          <Title>{data.name}</Title>

          <Spacing height={8} />
          {data.data.description && <Content>{data.data.description}</Content>}

          <Spacing height={8} />
          <div style={{ display: "flex", justifyContent: "space-between"}}>
            <Amount>
              {commaizeNumber(formatDecimals(raisedAmount.data || 0, 4))} /{" "}
              {commaizeNumber(formatEther(data.presaleAmount))}{" "}
              {process.env.NEXT_PUBLIC_CHAIN_SYMBOL}
            </Amount>

            <PercentageBadge>
              {formatDecimals(progress.data || 0, 2)}%
            </PercentageBadge>
            <Spacing height={4} />
          </div>
          <ProgressBar value={progress.data} size={5} />
        </div>
      </Flex.CenterHorizontal>
    </Container>
  );
}

export default SaleCard;

const Container = styled.div`
  cursor: pointer;
  ${hoverableStyle.scale(1.02)}
  ${pressableStyle.scale()}
  ${inDesktop(`
    // padding: 24px;
  `)}
`;

const ChainIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 100%;
`;

const StyledImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 6px;
  object-fit: cover;
  border: 2px solid #272727;
  ${inDesktop(`
    width: 104px;
    height: 104px;
  `)}
`;

const Title = styled.h3`
  color: #fff;
  text-align: left;
  font-size: 15px;
  font-style: normal;
  line-height: 20px; /* 141.176% */
  letter-spacing: -0.1px;

  color: #2eb335;
  font-weight: 700;
  -webkit-text-stroke: 0.5px black;

  ${inDesktop(`
    font-size: 20px;
    line-height: 24px; /* 141.176% */   
  `)}
`;

export const PercentageBadge = styled(Flex.Center)<{ full?: boolean }>`
  color: white;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: 13px; /* 100% */
  padding: 4px 8px;
  border-radius: 8px;
  ${inDesktop(`
    font-size: 13px;
    font-weight: 700;
    padding: 5px 7px;
  `)}
`;

const Content = styled.div`
  height: 34px;
  word-break: break-all;
  color: #FFF;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  ${inDesktop(`
    font-size: 15px;
    height: auto;
    -webkit-line-clamp: 3;
  `)}
`;

const Amount = styled.div`
  color: #fff;
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 160% */
  ${inDesktop(`
    font-size: 15px;
  `)}
`;
