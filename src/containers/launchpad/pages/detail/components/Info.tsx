import { Flex, inDesktop, Spacing, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { Badge } from "../../create/components/Components";
import { colors } from "@boxfoxs/bds-common";
import { chains } from "constants/chains";
import { LinkIcon } from "@heroicons/react/24/outline";

interface Props {
  presale: ParsedPresale;
}

export function InfoSection({ presale }: Props) {
  const isMobile = useCheckIsMobile();

  return (
    <Container>
      <div>
        <StyledImage src={presale.data.iconUrl} />
      </div>
      <Spacing width={isMobile ? 16 : 20} />
      <div style={{ padding: "8px 0" }}>
        <Name>{presale.name}</Name>
        <Spacing height={isMobile ? 8 : 12} />

        <Description>{presale.data.description || "-"}</Description>
        <Spacing height={8} />

        <BadgeContainer>
          {presale.data.websiteUrl ? (
            <a href={presale.data.websiteUrl} target="_blank" rel="noreferrer">
              <Badge color={colors.gray300} style={{ padding: "6px 8px" }}>
                <LinkIcon width={12} color={colors.gray300} /> Website
              </Badge>
            </a>
          ) : null}
          {presale.data.xUrl ? (
            <a href={presale.data.xUrl} target="_blank" rel="noreferrer">
              <Badge color={colors.gray300} style={{ padding: "6px 8px" }}>
                <img src="/images/ic_x_white.png" width={14} /> Twitter
              </Badge>
            </a>
          ) : null}
          {presale.data.telegramUrl ? (
            <a href={presale.data.telegramUrl} target="_blank" rel="noreferrer">
              <Badge
                color={colors.gray300}
                style={{ padding: "6px 8px 6px 6px" }}
              >
                <img src="/images/ic_telegram.png" width={16} /> Telegram
              </Badge>
            </a>
          ) : null}
          {presale.data.discordUrl ? (
            <a href={presale.data.discordUrl} target="_blank" rel="noreferrer">
              <Badge
                color={colors.gray300}
                style={{ padding: "6px 8px 6px 6px" }}
              >
                <img src="/images/Ic_discord_color.png" width={16} /> Discord
              </Badge>
            </a>
          ) : null}
        </BadgeContainer>
      </div>
    </Container>
  );
}

const BadgeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 8px;
  ${inDesktop(`
    display: flex;
    align-items: center;
    gap: 8px;
  `)}
`;

const Container = styled.div`
  display: flex;
  padding: 24px 24px 32px 24px;
`;

const StyledImage = styled.img`
  width: 88px;
  height: 88px;
  border-radius: 8px;
  border: 2px solid #272727;
  object-fit: cover;
  ${inDesktop(`
    width: 204px;
    height: 204px;
  `)}
`;

const Name = styled.div`
  color: #2EB335;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 109.091% */
  letter-spacing: -0.1px;
  ${inDesktop(`
    font-size: 36px;
  `)}
`;

const Description = styled.div`
  color: #d5ded7;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
  ${inDesktop(`
    font-size: 15px;
  `)}
`;
