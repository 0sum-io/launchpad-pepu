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
        <Title>PEPE&apos;S PUMP PAD</Title>
      </div>
      <div style={{ width: isMobile ? "100%" : "" }}>
        {/* <Description>
          It&apos;s where your creation of tokens come to life, <br /> igniting
          the dawn of what&apos;s next.
        </Description> */}
        <Spacing height={24} />
        <ConnectButton
          onClick={() => {
            form.clear();
            router.push("/create");
          }}
          theme="primary"
          rounded={isMobile ? 16 : 20}
          padding={isMobile ? "16px 0" : "20px 28px"}
          fullWidth={isMobile}
          textSize={isMobile ? 15 : 17}
          bold={600}
        >
          Make Token
        </ConnectButton>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
  width: 100%;
  ${inDesktop(`
    flex-direction: row;
    justify-content: space-between;
    align-items: end;
  `)}
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 32px; /* 128.571% */
  font-size: 70px;
  line-height: 72px; /* 128.571% */
  color: #2EB335;
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: black;
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
