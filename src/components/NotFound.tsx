import { adaptiveColors } from "@boxfoxs/bds-common";
import { Flex, Spacing, Text } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { PageContainer } from "components/PageContainer";
import { DISCORD_LINK, TWITTER_LINK } from "constants/links";

export function NotFound() {
  return (
    <PageContainer>
      <Flex.Center direction="column">
        <Spacing height={30} />
        <StyledImage src="/images/img_goverement.png" />
        <Text size="3xl" weight="bold" color={adaptiveColors.gray600}>
          Not found
        </Text>
        <Spacing height={8} />
        <Text color={adaptiveColors.gray500}>
          Get support from the community
        </Text>
        <Spacing height={24} />
        <Flex.CenterVertical style={{ gap: "18px" }}>
          <a href={TWITTER_LINK} target="_blank" rel="noreferrer">
            <StyledChangeButton>
              <SnsImage src="/images/ic_twitter_white.svg" />
            </StyledChangeButton>
          </a>
          <a href={DISCORD_LINK} target="_blank" rel="noreferrer">
            <StyledChangeButton>
              <SnsImage src="/images/ic_discord_white.svg" />
            </StyledChangeButton>
          </a>
        </Flex.CenterVertical>
      </Flex.Center>
    </PageContainer>
  );
}
const StyledImage = styled.img`
  max-width: 600px;
  width: 70%;
`;
const StyledChangeButton = styled.button`
  margin: auto;
  padding: 12px;
  border-radius: 99px;
  border: 1px solid #dee2e6;
  cursor: pointer;
  :hover {
    background: #e9e9e9;
  }
`;
const SnsImage = styled.img`
  width: 18px;
`;
