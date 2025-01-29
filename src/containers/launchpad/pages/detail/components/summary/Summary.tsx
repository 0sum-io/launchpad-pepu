import { colors } from "@boxfoxs/bds-common";
import {
  Divider,
  Flex,
  Spacing,
  Text,
  useCheckIsMobile,
} from "@boxfoxs/bds-web";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { formatEther } from "@ethersproject/units";
import { ProgressBar } from "components/ProgressBar";
import { chains } from "constants/chains";
import {
  useBondingCurveProgress,
  useRaisedAmount,
} from "containers/launchpad/hooks/useBondingCurveProgress";
import { PercentageBadge } from "containers/launchpad/pages/list/components";
import { useProvider, useTokenInfo } from "hooks/on-chain";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { getClearedSymbol } from "utils/checkIsNative";
import { formatDecimals, shortenAddress } from "utils/format";
import { hoverableStyle } from "utils/style";

interface Props {
  presale: ParsedPresale;
}

const SummarySection = ({ presale }: { presale: ParsedPresale }) => {
  const isMobile = useCheckIsMobile();
  const raisedAmount = useRaisedAmount(presale);
  const progress = useBondingCurveProgress(presale);
  const paymentToken = useTokenInfo(presale.chainId, presale.paymentToken);

  return (
    <Container>
      <Flex.CenterVertical>
        <div>
          <Text
            style={{ fontSize: isMobile ? "18px" : "24px", fontWeight: 700, fontFamily: "Grandstander" }}
            color={"#2EB335"}
            weight={"bold"}
          >
            {commaizeNumber(formatDecimals(raisedAmount.data || 0, 5))}
          </Text>
          <Spacing height={4} />
          <Text
            color="#fff"
            style={{ fontSize: isMobile ? "14px" : "14px", fontWeight: 500, fontFamily: "Grandstander" }}
          >
            / {commaizeNumber(formatEther(presale.presaleAmount))}{" "}
            {process.env.NEXT_PUBLIC_CHAIN_SYMBOL}
          </Text>
        </div>
        <Spacing flex={1} />
        <PercentageBadge
          style={{ fontSize: "16px", padding: "6px 7px" }}
        >
          {formatDecimals(progress.data || 0, 2)}%
        </PercentageBadge>
      </Flex.CenterVertical>

      <Spacing height={4} />
      <ProgressBar value={progress.data} size={5} />

      <Divider
        color="#272727"
        marginVertical={isMobile ? 16 : 24}
        width={"100%"}
      />
      <Flex.CenterVertical justify="space-between">
        <Info color="#fff" style={{ fontSize: isMobile ? "13px" : "15px", fontWeight: 400 }}>
          Token Address
        </Info>
        <Link>
          <a style={{ fontSize: isMobile ? "13px" : "15px", fontWeight: 700 }}
            href={`${chains[presale.chainId].blockExplorerUrls[0]}/address/${
              presale.token
            }`}
            target="_blank"
            rel="noreferrer"
          >
            {shortenAddress(presale.token, 4)}
          </a>
        </Link>
      </Flex.CenterVertical>
      <Spacing height={8} />
      <Flex.CenterVertical justify="space-between">
        <Info color="#fff" style={{ fontSize: isMobile ? "13px" : "15px", fontWeight: 400 }}>
          Pair Address
        </Info>
        <Link>
          <a style={{ fontSize: isMobile ? "13px" : "15px", fontWeight: 700 }}
            href={`${chains[presale.chainId].blockExplorerUrls[0]}/address/${
              presale.pairAddress
            }`}
            target="_blank"
            rel="noreferrer"
          >
            {shortenAddress(presale.pairAddress, 4)}
          </a>
        </Link>
      </Flex.CenterVertical>
    </Container>
  );
};

export default SummarySection;

const Container = styled.div`
  background-color: #161616;
  padding: 24px 24px 32px 24px;
  border-radius: 16px;
  border: 2px solid #272727;
`;

export function DeployedDexBadge({ data }: { data: ParsedPresale }) {
  return (
    <Container>
      <Text size="lg" color={colors.white} weight="semibold">
        Bonding curve has ended
      </Text>
      <Spacing height={24} />
      <a
        href={`${process.env.NEXT_PUBLIC_DEX_URL}/#/swap?outputCurrency=${data.token}`}
        target="_blank"
        rel="noreferrer"
      >
        <StyledBadge>Visit DEX</StyledBadge>
      </a>
      <Spacing height={24} />
      <iframe
        src={`${process.env.NEXT_PUBLIC_DEX_URL}/#/swap?theme=dark&inputCurrency=${data.paymentToken}&outputCurrency=${data.id}`}
        scrolling="no"
        style={{
          border: "none",
          width: '100%',
          height: '700px',
        }}
      />
    </Container>
  );
}

const StyledBadge = styled.div`
  text-align: center;
  background-color: ${process.env.NEXT_PUBLIC_COLOR};
  padding: 16px 18px;
  border-radius: 32px;
  font-size: 17px;
  font-weight: 700;
  ${hoverableStyle.scale(1.02)};

  border: 4px solid black;
  color: #272727;
`;

const Info = styled.div`
  font-family: Grandstander;
  color: #fff;
`;

const Link = styled.div`
  color: ${process.env.NEXT_PUBLIC_COLOR};
  font-family: Grandstander;
`;
