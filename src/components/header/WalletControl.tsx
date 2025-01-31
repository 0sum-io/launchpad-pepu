import React, { useEffect, useState } from "react";
import { inDesktop, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";

import { ConnectButton } from "components/Button";
import { useThirdWeb } from "components/provider/ThirdWebProvider";
import { useAddress } from "hooks/on-chain";
import { hoverableStyle, pressableStyle } from "utils/style";
import { getBalanceOf } from "../../utils/getHolderList";
import { formatUnits } from "ethers/lib/utils";

const WalletControlLazy = ({ left = "-100px" }: { left?: string }) => {
  const isMobile = useCheckIsMobile();
  const open = useThirdWeb();
  const address = useAddress();
  const [tokenHoldings, setWalletData] = useState([]);
  const [haveTokens, setTokenHoldingsState] = useState(undefined);

  // Fetch address holding after connecting wallet
  useEffect(() => {

    if (!address) return;

    // Reset on wallet change
    setTokenHoldingsState(undefined);
    setWalletData([]);

    const addressFormated = address.toLowerCase();
    fetchWalletHoldings(addressFormated);

  }, [address]);

  const fetchWalletHoldings = async (wallet: string) => {
    const query = `
      query GetWalletHoldingsData {
        accountBalances( where: { account: "${wallet}" } ) {
          token {
            id
            name
            symbol
          }
          account {
            address
          }
        }
      }
    `;

    const walletHoldingsJson = await fetch(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());

    if (!walletHoldingsJson.data.accountBalances) return;

    // Remove WPEPU from the list
    walletHoldingsJson.data.accountBalances = walletHoldingsJson.data.accountBalances.filter(
      (token) => token.token.symbol !== "WPEPU"
    );

    // Find out token data over Graph
    const accountBalances = walletHoldingsJson.data.accountBalances;
    const tokenIds = accountBalances.map(balance => balance.token.id.toLowerCase());

    console.log(tokenIds); // Outputs an array of token IDs
    const allWalletTokens = await fetchTokenData(tokenIds);

    // Find out amount of each token via balanceOf calls
    if (walletHoldingsJson.data.accountBalances.length > 0) {
      for (let token of walletHoldingsJson.data.accountBalances) {
        const tokenBalance = await fetchBalanceOf(token);
        token['balance'] = parseFloat(tokenBalance);

        // Find same token in allWalletTokens
        const tokenData = allWalletTokens.find(t => t.token === token.token.id);
        if (tokenData) {
          token['data'] = JSON.parse(tokenData.data)
          token['presale_id'] = tokenData.id;
        };
      }
      setTokenHoldingsState(true);
    } else {
      console.log("No tokens found in the wallet");
      setTokenHoldingsState(false);
    }

    // Show highest balance first
    walletHoldingsJson.data.accountBalances.sort((a, b) => b.balance - a.balance);
    // Filter out those with dust balance means less than 0.0000000001 
    walletHoldingsJson.data.accountBalances = walletHoldingsJson.data.accountBalances.filter(token => token.balance > 0.0001);
    // console.log("Outputs an array of token balances >>>>>>>>", walletHoldingsJson.data.accountBalances); // Outputs an array of token balances
    
    setWalletData(walletHoldingsJson.data.accountBalances);
  };

  const fetchTokenData = async (tokenIDs: any) => {
    const query = `
      query GetTokensData {
        presales(where: { token_in: [${tokenIDs.map(id => `"${id}"`).join(",")}] }) {
          id
          data
          name
          symbol
          token
        }
      }
    `;

    const tokensDataJson = await fetch(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());

    // console.log("tokensDataJson ----> ", tokensDataJson);
    return tokensDataJson.data.presales;
  };

  const fetchBalanceOf = async (tokenData: any) => {
    const balanceOfToken = await getBalanceOf(tokenData.token.id, address);
    return formatUnits(balanceOfToken, 18);
  };
  
  const handleClick = () => {
    open();
  };

  return (
    <ButtonContainer left={left}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {address ? (
          <>
            <PortfolioHolding>Your Portfolio Holdings</PortfolioHolding>
            {
              haveTokens === false &&
                <StyledParagraph style={{ textAlign: "center", fontSize: "13px", color: "#757575" }}>No tokens found in the wallet</StyledParagraph>
            }
            {
              (tokenHoldings.length === 0 && haveTokens === undefined) &&
                <StyledParagraph style={{ textAlign: "center", fontSize: "13px", color: "#757575" }}>Loading wallet balances...</StyledParagraph>
            }
            {
              haveTokens &&
                <TokenTable>
                  {tokenHoldings.map((token) => (
                    <a href={`/${token.token.id}`} key={token.id}>
                      <TokenRow key={token.id}>
                        <TokenAvatar src={token.data.iconUrl} alt={token.name} />
                        <div style={{ display: "flex", flexDirection: "column", width: "100%", paddingLeft: "20px" }}>
                          <TokenSubRow>
                            <TokenName>{token.token.name}</TokenName>
                            {/* <TokenProfit positive={token.percentage.startsWith("+")}>
                              {token.percentage} ({token.profit})
                            </TokenProfit> */}
                          </TokenSubRow>
                          <TokenSubRow>
                            <TokenBalance>{token.balance} {/* <span style={{ color: "#aaa", fontSize: "11px" }}>({token.usdValue})</span> */}</TokenBalance>
                          </TokenSubRow>
                        </div>
                      </TokenRow>
                    </a>
                  ))}
                </TokenTable>
            }
            </>
        ) : (
          <StyledParagraph>Connect your wallet to see your holdings</StyledParagraph>
        )}
        <ConnectButton
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
  padding-bottom: 15px;
`;

const TokenTable = styled.div`
  display: flex;
  flex-direction: column;
  height: 140px;
  overflow: scroll;
`;

const TokenRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
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