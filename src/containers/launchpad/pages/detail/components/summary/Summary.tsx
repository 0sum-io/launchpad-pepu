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
import { chains } from "constants/chains";
import {
  useBondingCurveProgress,
  useRaisedAmount,
} from "containers/launchpad/hooks/useBondingCurveProgress";
import { PercentageBadge } from "containers/launchpad/pages/list/components";
import { useTokenInfo } from "hooks/on-chain";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { getClearedSymbol } from "utils/checkIsNative";
import { formatDecimals, shortenAddress } from "utils/format";
import { hoverableStyle } from "utils/style";

interface Props {
  presale: ParsedPresale;
}

export function SummarySection({ presale }: Props) {
  const isMobile = useCheckIsMobile();
  const raisedAmount = useRaisedAmount(presale);
  const progress = useBondingCurveProgress(presale);
  const paymentToken = useTokenInfo(presale.chainId, presale.paymentToken);

  return (
    <Container className="SummarySection">
      <Flex.CenterVertical>
        <div>
          <Text
            style={{ fontSize: isMobile ? "18px" : "22px", fontWeight: 600 }}
            color={"white"}
            weight={"bold"}
          >
            {commaizeNumber(formatDecimals(raisedAmount.data || 0, 5))}
          </Text>
          <Spacing height={4} />
          <Text
            color="#fff"
            style={{ fontSize: isMobile ? "14px" : "16px", fontWeight: 600 }}
          >
            / {commaizeNumber(formatEther(presale.presaleAmount))}{" "}
            {getClearedSymbol(paymentToken.data?.symbol || "-")}
          </Text>
        </div>
        <Spacing flex={1} />
        <PercentageBadge
          full={true}
          style={{ fontSize: "16px", padding: "6px 7px" }}
        >
          {formatDecimals(progress.data || 0, 2)}%
        </PercentageBadge>
      </Flex.CenterVertical>
      <Divider
        color="#272727"
        marginVertical={isMobile ? 16 : 24}
        width={"100%"}
      />
      <Flex.CenterVertical justify="space-between">
        <Info color="#fff" style={{ fontSize: isMobile ? "13px" : "15px" }}>
          Token Address
        </Info>
        <Link>
          <a
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
        <Info color="#fff" style={{ fontSize: isMobile ? "13px" : "15px" }}>
          Pair Address
        </Info>
        <Link>
          <a
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
}

const Container = styled.div`
  padding: 24px 24px 32px 24px;

  border-radius: 32px;
  border: 4px solid #272727;
  box-shadow: rgb(0, 0, 0) 4px 4px;
  background: rgb(48, 104, 185);
  backdrop-filter: blur(30px);
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
        <StyledBadge>Trade</StyledBadge>
      </a>
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
