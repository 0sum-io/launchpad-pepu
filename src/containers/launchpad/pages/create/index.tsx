import { inDesktop, Spacing, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { PageContainer } from "components/PageContainer";
import { PresaleForm } from "./components";
import { FadeAnimation } from "components/animation";

export default function CreatePresalePage() {
  const isMobile = useCheckIsMobile();

  return (
    <PageContainer>
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            overflow: "hidden",
            width: "100%",
            height: "100%",
          }}
        >
          {/* <StyledBackground src="/images/img_swap_bg.png" alt="bg" />
          <CloudImg1 src="/images/img_cloud_big.png" alt="cloud" />
          <CloudImg2 src="/images/img_cloud_big.png" alt="cloud" /> */}
          <StarImg1 src="/images/img_star_2.svg" alt="star" />
          <StarImg2 src="/images/img_star.svg" alt="star" />
        </div>
      )}
      <FadeAnimation>
        <Spacing height={isMobile ? 60 : 104} />
        <ContentContainer>
          <Title>CREATE TOKEN</Title>
          <Spacing height={isMobile ? 4 : 16} />
          <Description>
            {/* Your token will be listed once you submit your token info. */}
          </Description>
          <Spacing height={32} />
          <PresaleForm />
        </ContentContainer>
        <Spacing height={isMobile ? 60 : 168} />
      </FadeAnimation>
    </PageContainer>
  );
}

const StyledBackground = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 0;
  width: 1920px;
`;

const CloudImg1 = styled.img`
  position: absolute;
  top: 94px;
  left: calc(50% - 480px);
  width: 210px;
  opacity: 0.8;
`;

const CloudImg2 = styled.img`
  position: absolute;
  top: 165px;
  left: calc(50% + 180px);
  width: 330px;
`;

const StarImg1 = styled.img`
  position: absolute;
  top: 244px;
  left: calc(50% - 430px);
  width: 32px;
`;

const StarImg2 = styled.img`
  position: absolute;
  top: 165px;
  left: calc(50% + 440px);
  width: 40px;
`;

const ContentContainer = styled.div`
  max-width: 732px;
  margin: 0 auto;
  padding: 0 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  line-height: 32px; /* 128.571% */
  font-size: 70px;
  line-height: 72px; /* 128.571% */

  color: ${process.env.NEXT_PUBLIC_COLOR};
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: black;
  font-family: Grandstander-Black;
`;

const Description = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.1px;
  font-size: 16px;
`;
