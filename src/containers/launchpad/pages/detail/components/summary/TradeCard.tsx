import { Flex, Spacing, Text, useCheckIsMobile } from "@boxfoxs/bds-web";
import { useAsyncCallback } from "@boxfoxs/core-hooks";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { ConnectButton } from "components/Button";
import { useThirdWeb } from "components/provider/ThirdWebProvider";
import {
  useQuoteOutAmount,
  useTradePresaleToken,
} from "containers/launchpad/hooks";
import { usePresaleContract } from "contracts/evm/contract/PresaleContract";
import {
  useAccount,
  useSupportChain,
  useTokenBalance,
  useTokenInfo,
} from "hooks/on-chain";
import { useEffect, useState } from "react";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { getClearedSymbol, getTokenIcon } from "utils/checkIsNative";
import { formatDecimals } from "utils/format";
import { TabItem } from "../statistics";
import { TokenInput } from "./TokenInput";
import { LoadingLottie } from "components/lotties/LoadingLottie";

export function TradeCard({ presale }: { presale: ParsedPresale }) {
  const isMobile = useCheckIsMobile();
  const account = useAccount();
  const connect = useThirdWeb();
  const paymentToken = useTokenInfo(presale.chainId, presale.paymentToken);
  const token = useTokenInfo(presale.chainId, presale.token);
  const [inValue, setInValue] = useState("");
  const [currentTab, setCurrentTab] = useState<"buy" | "sell">("buy");
  const isBuy = currentTab === "buy";
  const balance = useTokenBalance(isBuy ? paymentToken.data : token.data);
  const quote = useQuoteOutAmount(
    {
      ...presale,
      paymentToken: isBuy ? presale.paymentToken : presale.token,
      token: isBuy ? presale.token : presale.paymentToken,
    },
    inValue
  );
  const { buy, sell } = useTradePresaleToken(presale);

  useEffect(() => {
    setInValue("");
  }, [currentTab]);

  const chain = useSupportChain();
  const isNeedSwitchChain = chain.walletChainId !== presale.chainId;

  const swap = useAsyncCallback(async () => {
    if (!account) {
      connect();
      return;
    }
    if (isNeedSwitchChain) {
      chain.switch(presale.chainId);
      return;
    }
    if (isBuy) {
      await buy.callback(inValue);
    } else {
      await sell.callback(inValue);
    }
  });

  const presaleContract = usePresaleContract(presale.id);

  return (
    <Container className="TradeCard">
      <Flex.CenterVertical>
        <TabItem active={isBuy} onClick={() => setCurrentTab("buy")}>
          Buy
        </TabItem>
        <TabItem active={!isBuy} onClick={() => setCurrentTab("sell")}>
          Sell
        </TabItem>
      </Flex.CenterVertical>
      <Spacing height={24} />
      <TokenInput
        icon={isBuy ? getTokenIcon(paymentToken.data) : presale.data.iconUrl}
        symbol={isBuy ? paymentToken.data?.symbol : presale.symbol}
        value={inValue}
        onChange={setInValue}
        balance={Number(balance?.toExact() || 0)}
      />
      <Spacing height={32} />
      <div>
        <Txt color="#fff">You Receive</Txt>
        <Spacing height={12} />
        <Flex.CenterVertical>
          <TokenIcon
            src={isBuy ? presale.data.iconUrl : getTokenIcon(paymentToken.data)}
          />
          <Spacing width={12} />
          <Text
            style={{ fontSize: isMobile ? "15px" : "17px", fontWeight: 600 }}
            color="#fff"
          >
            {getClearedSymbol(
              isBuy ? presale.symbol : paymentToken.data?.symbol
            )}
          </Text>
          <Spacing flex={1} />
          {quote.isLoading ? (
            <LoadingLottie width={24} />
          ) : (
            <Text
              style={{ fontSize: isMobile ? "15px" : "17px", fontWeight: 600 }}
              color="#fff"
            >
              {quote.data
                ? commaizeNumber(Number(formatDecimals(quote.data, 6)))
                : "-"}
            </Text>
          )}
        </Flex.CenterVertical>
      </div>
      <Spacing height={28} />
      <Flex.CenterVertical>
        <ConnectButton
          theme="primary"
          rounded={10}
          textSize={isMobile ? 15 : 17}
          fullWidth
          style={{ height: "54px" }}
          onClick={swap.callback}
          loading={swap.isLoading}
        >
          {!account
            ? "Connect Wallet"
            : isNeedSwitchChain
            ? "Switch Chain"
            : isBuy
            ? "BUY"
            : "SELL"}
        </ConnectButton>
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

const TokenIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: #272727;
  object-fit: cover;
  object-position: center;
`;

const Txt = styled.div`
  color: #fff;
  font-family: Grandstander;
`;