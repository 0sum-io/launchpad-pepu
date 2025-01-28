import { inDesktop, Spacing, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { ConnectButton } from "components/Button";
import { useRouter } from "next/router";
import { useCreatePresaleState } from "../../create/hooks/useCreateStore";
import { Badge } from "../../create/components/Components";

export function TitleSection() {
  const router = useRouter();
  const isMobile = useCheckIsMobile();
  const form = useCreatePresaleState();

  return (
    <Container>
      <div>
        <div>
          {/* <Badge style={{ display: "inline-flex" }}>BETA</Badge> */}
          <Spacing height={12} />
        </div>
        <Title> {/* FEATURED */} </Title>
        {/* <WalletControl /> */}
      </div>
      <div style={{ width: isMobile ? "100%" : "" }}>
        {/* <Description>
          It&apos;s where your creation of tokens come to life, <br /> igniting
          the dawn of what&apos;s next.
        </Description> */}
        <Spacing height={24} />
        {/* <ConnectButton style={{ left: "-150%"}}
          onClick={() => {
            form.clear();
            router.push("/create");
          }}
          theme="primary"
          rounded={isMobile ? 16 : 20}
          padding={isMobile ? "16px 0" : "20px 28px"}
          fullWidth={isMobile}
          textSize={isMobile ? 15 : 20}
          bold={600}
        >
          Create Token
        </ConnectButton> */}
      </div>
    </Container>
  );
}

const Container = styled.div`
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  ${inDesktop(`
    z-index: 10;
    position: relative;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    width: 330px;
    margin-right: auto;
    padding-left: 130px;
    padding-top: 30px;
  `)}
`;

const Title = styled.div`
  font-size: 48px;
  font-weight: 700;
  line-height: 32px; /* 128.571% */
  line-height: 72px; /* 128.571% */
  color: #FFF;
  /* -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: black; */
  font-family: Grandstander-Black;
`;

const Description = styled.div`
  color: #9e9ea4;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: -0.1px;
  ${inDesktop(`
    font-size: 16px;
    line-height: 26px;
  `)}
`;
