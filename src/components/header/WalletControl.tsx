import React from "react";
import { inDesktop, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";

import { ConnectButton } from "components/Button";
import { useThirdWeb } from "components/provider/ThirdWebProvider";
import { useAddress } from "hooks/on-chain";
import { shortenAddress } from "utils/format";
import { hoverableStyle, pressableStyle } from "utils/style";

export function WalletControl({ left = "-100px" }: { left?: string }) {
  const isMobile = useCheckIsMobile();
  const open = useThirdWeb();
  const address = useAddress();

  // Dummy data for token holdings
  const tokenHoldings = [
    {
      id: 1,
      name: "$GRNY",
      balance: "56437887 WPEPU",
      usdValue: "$7304.32",
      percentage: "+21%",
      profit: "+$1351.1",
      avatar: "https://via.placeholder.com/50", // Replace with actual image
    },
    {
      id: 2,
      name: "$MXFRG",
      balance: "232233 WPEPU",
      usdValue: "$304.32",
      percentage: "+121%",
      profit: "+$253",
      avatar: "https://via.placeholder.com/50", // Replace with actual image
    },
  ];
  
  const handleClick = () => {
    open();
  };

  return (
    <ButtonContainer left={left}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {address ? (
          <>
            <PortfolioHolding>Your Portfolio Holdings</PortfolioHolding>
            <TokenTable>
              {tokenHoldings.map((token) => (
                <TokenRow key={token.id}>
                  <TokenAvatar src={process.env.NEXT_PUBLIC_LOGO} alt={token.name} />
                  <div style={{ display: "flex", flexDirection: "column", width: "100%", paddingLeft: "20px" }}>
                    <TokenSubRow>
                      <TokenName>{token.name}</TokenName>
                      <TokenProfit positive={token.percentage.startsWith("+")}>
                        {token.percentage} ({token.profit})
                      </TokenProfit>
                    </TokenSubRow>
                    <TokenSubRow>
                      <TokenBalance>{token.balance} <span style={{ color: "#aaa", fontSize: "11px" }}>({token.usdValue})</span></TokenBalance>
                    </TokenSubRow>
                  </div>
                </TokenRow>
              ))}
            </TokenTable>
          </>
        ) : (
          <StyledParagraph>Connect your wallet to see your holdings</StyledParagraph>
        )}
        <ConnectButton
          className="WalletControl"
          theme="primary"
          onClick={handleClick}
          padding={"12px 24px"}
          textSize={16}
          style={{ color: "#000", background: "#2eb335", fontSize: "20px" }}
        >
          {address ? "Logout" : "Connect Wallet"}
        </ConnectButton>
      </div>
    </ButtonContainer>
    /* ${shortenAddress(address)} */
  );
}

const WalletControlLazy = ({ left = "-100px" }: { left?: string }) => {
  const isMobile = useCheckIsMobile();
  const open = useThirdWeb();
  const address = useAddress();

  // Dummy data for token holdings
  const tokenHoldings = [
    {
      id: 1,
      name: "$GRNY",
      balance: "56437887 WPEPU",
      usdValue: "$7304.32",
      percentage: "+21%",
      profit: "+$1351.1",
      avatar: "https://via.placeholder.com/50", // Replace with actual image
    },
    {
      id: 2,
      name: "$MXFRG",
      balance: "232233 WPEPU",
      usdValue: "$304.32",
      percentage: "+121%",
      profit: "+$253",
      avatar: "https://via.placeholder.com/50", // Replace with actual image
    },
  ];
  
  const handleClick = () => {
    open();
  };

  return (
    <ButtonContainer left={left}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {address ? (
          <>
            <PortfolioHolding>Your Portfolio Holdings</PortfolioHolding>
            <TokenTable>
              {tokenHoldings.map((token) => (
                <TokenRow key={token.id}>
                  <TokenAvatar src={process.env.NEXT_PUBLIC_LOGO} alt={token.name} />
                  <div style={{ display: "flex", flexDirection: "column", width: "100%", paddingLeft: "20px" }}>
                    <TokenSubRow>
                      <TokenName>{token.name}</TokenName>
                      <TokenProfit positive={token.percentage.startsWith("+")}>
                        {token.percentage} ({token.profit})
                      </TokenProfit>
                    </TokenSubRow>
                    <TokenSubRow>
                      <TokenBalance>{token.balance} <span style={{ color: "#aaa", fontSize: "11px" }}>({token.usdValue})</span></TokenBalance>
                    </TokenSubRow>
                  </div>
                </TokenRow>
              ))}
            </TokenTable>
          </>
        ) : (
          <StyledParagraph>Connect your wallet to see your holdings</StyledParagraph>
        )}
        <ConnectButton
          className="WalletControl"
          theme="primary"
          onClick={handleClick}
          padding={"12px 24px"}
          textSize={16}
          style={{ color: "#000", background: "#2eb335", fontSize: "20px" }}
        >
          {address ? "Logout" : "Connect Wallet"}
        </ConnectButton>
      </div>
    </ButtonContainer>
    /* ${shortenAddress(address)} */
  );
};

export default WalletControlLazy;

const ButtonContainer = styled.div<{ left?: string }>`
  position: relative;
  width: 329px;
  text-align: center;
  border: 2px solid #3b3b3b;
  padding: 20px;
  border-radius: 16px;
  margin-left: auto;
  margin-right: auto;
  background: #161616;
  height: max-content;
  left: ${(props) => props.left || "-100px"};
  
  ${hoverableStyle.scale(1.02)}
  ${pressableStyle.scale()}

    ${inDesktop(`
      position: relative;
      width: 329px;
      text-align: center;
      border: 2px solid #3b3b3b;
      padding: 20px;
      border-radius: 16px;
      margin-left: auto;
      margin-right: auto;
      background: #161616;
      height: max-content;
  `)}
`;

const StyledParagraph = styled.p`
  color: #fff;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: 700;
  padding-bottom: 15px;
`;

const PortfolioHolding = styled.p`
  color: #fff;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: 700;
`;

const TokenTable = styled.div`
  display: flex;
  flex-direction: column;
`;

const TokenRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #1a1a1a;
`;

const TokenSubRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

const TokenAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  min-width: 40px;
  border: 2px solid #252628;
`;

const TokenName = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #fff;
`;

const TokenBalance = styled.div`
  font-size: 13px;
  color: #fff;
`;

const TokenProfit = styled.div<{ positive: boolean }>`
  font-size: 12px;
  font-weight: bold;
  margin-left: auto;
  color: ${(props) => (props.positive ? "#2eb335" : "#ff3333")};
`;