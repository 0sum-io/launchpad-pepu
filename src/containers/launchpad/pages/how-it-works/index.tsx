import { Flex, inDesktop, Spacing, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { FadeAnimation } from "components/animation";
import { PageContainer } from "components/PageContainer";
import dynamic from "next/dynamic";
import Link from "next/link";
import { hoverableStyle, pressableStyle } from "utils/style";

export default function HomePage() {
  const isMobile = useCheckIsMobile();

  const WalletControlLazy = dynamic(
    () => import("../../../../components/header/WalletControl"),
    {
      loading: () => <p>Loading...</p>, // Optional fallback while loading
    }
  );

  return (
    <PageContainer>
      <FadeAnimation>
        <ContentContainer>
          <Spacing height={isMobile ? 25 : 35} />
          <Flex.CenterVertical align="start">
            <div>
              <WalletControlLazy left="0px" />
            </div>

            <Spacing width={28} />

            <div style={{ flex: 1, maxWidth: "900px" }}>
              <MainHeader> How it works </MainHeader>
              <Spacing height={8} />
              <SubHeader> Getting Started with Pump pad </SubHeader>

              {/* STEP 1 - Add Pepe Unchained L2 Network */}
              <Spacing height={28} />
              <SubHeader> Step 1: Add Pepe Unchained L2 Network </SubHeader>

              <Spacing height={14} />
              <Content>
                {" "}
                Connect your wallet to the Pump Pad (link) and you will be
                automatically prompted to add the lightning-fast Layer 2 to your
                wallet. Follow the prompts, until the network is added. We
                suggest the Metamask wallet for compatibility.Not all wallets
                support custom networks. Please verify that you wallet is
                compatible.{" "}
              </Content>

              <Spacing height={28} />
              <ContentSecond>
                Wallets with custom network support:
                <Spacing height={8} />
                <ul style={{ paddingLeft: "25px" }}>
                  <li> Metamask </li>
                  <li> Coinbase Wallet (Recovery phrase wallets only) </li>
                  <li> Trust Wallet (only Android, or browser extension) </li>
                  <li> Rainbow Wallet (Browser extension) </li>
                </ul>
              </ContentSecond>

              <Spacing height={28} />
              <ContentSecond>
                <span style={{ color: "#FBFF00" }}>IMPORTANT NOTE:</span> Not
                All Wallets Support Custom Networks. These wallets include:
                <Spacing height={8} />
                <ul style={{ paddingLeft: "25px" }}>
                  <li> Binance Web3 wallet </li>
                  <li> Coinbase Smart Wallet </li>
                  <li> Best Wallet </li>
                  <li> ByBit (cloud wallet) </li>
                  <li>
                    <a
                      href="https://help.superbridge.app/en/articles/10293436-pepe-unchained-pepu-troubleshooting"
                      target="_blank"
                      style={{ textDecoration: "underline" }}
                      rel="noreferrer"
                    >
                      And more…
                    </a>
                  </li>
                </ul>
              </ContentSecond>

              <Spacing height={14} />
              <Content>
                {" "}
                Furthermore, to make transactions, stake, or withdraw from Pepe
                Unchained Layer 2 your wallet needs support for custom networks.
                If your wallet does not have support for custom networks, then
                do not bridge until you have imported your wallet into one that
                does.
                <a
                  href="https://help.superbridge.app/en/articles/10293436-pepe-unchained-pepu-troubleshooting"
                  target="_blank"
                  style={{ textDecoration: "underline" }}
                  rel="noreferrer"
                >
                  Learn more…
                </a>
              </Content>

              <Spacing height={14} />
              <div>
                <iframe
                  src="https://drive.google.com/file/d/1QWFnVAGKGsRVPCLCNZzoSPFGa6SjYoBS/preview"
                  style={{
                    width: "70%",
                    height: "350px",
                    border: "2px solid #3B3B3B",
                    borderRadius: "16px",
                  }}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  title="FIRST"
                ></iframe>
              </div>

              {/* STEP 2 - Bridge your assets */}
              <Spacing height={28} />
              <SubHeader> step 2: Bridge $PEPU to Layer 2 </SubHeader>

              <Spacing height={14} />
              <Content>
                {" "}
                To utilize the pump pad, you&apos;ll need to bridge your PEPU
                tokens to Layer 2 with Pepe
                <a
                  href="https://pepubridge.com/"
                  target="_blank"
                  style={{ textDecoration: "underline" }}
                  rel="noreferrer"
                >
                  Unchained Bridge.
                </a>{" "}
                Simply connect your wallet, and bridge!
              </Content>

              <Spacing height={14} />
              <Content>
                {" "}
                You can also buy $PEPU directly within the Layer 2 PepuSwap, but
                will need ETH, USDT, or USDC to be bridged via the method above.
              </Content>

              <Spacing height={14} />
              <Content style={{ color: "#FBFF00" }}> WARNING: </Content>
              <Content>
                {" "}
                Do not bridge using a wallet that doesn&apos;t support Pepe
                Unchained Layer 2.{" "}
              </Content>

              <Spacing height={28} />
              <ContentSecond>
                <span style={{ color: "#FBFF00" }}>IMPORTANT NOTE:</span> Not
                All Wallets Support Custom Networks. These wallets include:
                <Spacing height={8} />
                <ul style={{ paddingLeft: "25px" }}>
                  <li> Binance Web3 wallet </li>
                  <li> Coinbase Smart Wallet </li>
                  <li> Best Wallet </li>
                  <li> ByBit (cloud wallet) </li>
                  <li>
                    <a
                      href="https://help.superbridge.app/en/articles/10293436-pepe-unchained-pepu-troubleshooting"
                      target="_blank"
                      style={{ textDecoration: "underline" }}
                      rel="noreferrer"
                    >
                      And more…
                    </a>
                  </li>
                </ul>
              </ContentSecond>

              <Spacing height={14} />
              <Content>
                {" "}
                Furthermore, to make transactions, stake, or withdraw from Pepe
                Unchained Layer 2 your wallet needs support for custom networks.
                If your wallet does not have support for custom networks, then
                do not bridge until you have imported your wallet into one that
                does.
                <a
                  href="https://help.superbridge.app/en/articles/10293436-pepe-unchained-pepu-troubleshooting"
                  target="_blank"
                  style={{ textDecoration: "underline" }}
                  rel="noreferrer"
                >
                  Learn more…
                </a>
              </Content>

              <Spacing height={36} />
              <img src="/images/step2_how_to.png" width={600} alt="" />

              <Spacing height={14} />
              <div>
                <iframe
                  src="https://drive.google.com/file/d/16LBVARQ_oCijDUEacDeYLa5vHtiIj5Rd/preview"
                  style={{
                    width: "70%",
                    height: "350px",
                    border: "2px solid #3B3B3B",
                    borderRadius: "16px",
                  }}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  title="SECOND"
                ></iframe>
              </div>

              {/* STEP 3 - Enjoy the PUMP! */}
              <Spacing height={28} />
              <SubHeader> Step 3: Enjoy the PUMP! </SubHeader>

              <Spacing height={14} />
              <div>
                <iframe
                  src="https://drive.google.com/file/d/19uxxx7rQ2dElI9y04dyi1-eHIdY_zVhl/preview"
                  style={{
                    width: "70%",
                    height: "350px",
                    border: "2px solid #3B3B3B",
                    borderRadius: "16px",
                  }}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  title="THIRD"
                ></iframe>
              </div>

              <Spacing height={14} />
              <Content>
                {" "}
                Now it’s time to have fun! Go back to the pump pad and buy,
                create, and most of all–have fun.{" "}
              </Content>

              <Spacing height={28} />
              <Note>
                {" "}
                <span style={{ color: "#FFF" }}>Please note:</span>{" "}
                Cryptocurrency trading involves significant risks. Always
                conduct thorough research and never invest more than you can
                afford to lose. Verify all platform addresses and contract
                information independently.{" "}
              </Note>

              <Spacing height={32} />
              <MainHeader style={{ textAlign: "center" }}>
                {" "}
                What’s next?{" "}
              </MainHeader>

              <Spacing height={18} />
              <div style={{ display: "flex", alignItems: "center" }}>
                <Link href="/">
                  <ButtonContainer>Buy a token</ButtonContainer>
                </Link>

                <p style={{ fontSize: "15px", color: "#fff" }}> or </p>

                <Link href="/create">
                  <ButtonContainer>Create a token</ButtonContainer>
                </Link>
              </div>
            </div>
          </Flex.CenterVertical>
          <Spacing height={40} />
        </ContentContainer>
      </FadeAnimation>
    </PageContainer>
  );
}

const ContentContainer = styled.div`
  margin: 0 auto;
  padding: 0 20px;
  z-index: 1;
  ${inDesktop(`
        z-index: 1;
        position: relative;
    `)}
`;

const MainHeader = styled.div`
  font-family: Grandstander;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 36px;
  color: #fff;
`;

const SubHeader = styled.div`
  font-family: Grandstander;
  text-transform: uppercase;
  height: 25px;
  font-weight: 700;
  font-size: 24px;
  color: #fff;
`;

const Content = styled.div`
  font-family: Grandstander;
  line-height: 21px;
  font-size: 15px;
  color: #fff;
  height: auto;
`;

const ContentSecond = styled.div`
  font-family: Grandstander;
  line-height: 21px;
  font-weight: 700;
  font-size: 15px;
  color: #fff;
  height: auto;
`;

const Note = styled.div`
  font-family: Grandstander;
  font-style: italic;
  text-align: center;
  line-height: 18px;
  font-weight: 400;
  font-size: 13px;
  color: #939393;
  height: auto;
`;

const ButtonContainer = styled.div`
  font-family: Grandstander;
  font-size: 20px;
  position: relative;
  width: 220px;
  text-align: center;
  border: 2px solid #000;
  padding: 20px;
  border-radius: 35px;
  margin-left: auto;
  margin-right: auto;
  background: #2eb335;
  height: max-content;
  color: #000;
  cursor: pointer;
  font-weight: 700;

  ${hoverableStyle.scale(1.02)}
  ${pressableStyle.scale()}

    ${inDesktop(`
        position: relative;
        width: 220px;
        text-align: center;
        border: 2px solid #000;
        padding: 20px;
        border-radius: 35px;
        margin-left: auto;
        margin-right: auto;
        height: max-content;
        font-weight: 700;
    `)}
`;
