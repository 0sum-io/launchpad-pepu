import { Flex, Spacing, inDesktop, useCheckIsMobile } from "@boxfoxs/bds-web";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { Currency, CurrencyAmount } from "@sushiswap/core-sdk";
import { useTokenBalance } from "hooks/on-chain";
import React, { ReactNode } from "react";
import { parseToFixed } from "utils/format";
import { InputField, MaxButton, StyledInput } from "./components";
import { getClearedSymbol } from "utils/checkIsNative";

interface Props {
  token?: Currency;
  label?: string;
  left?: ReactNode;
  amount: number | string;
  onAmountChange?: (value: string) => void;
  simple?: boolean;
  placeholder?: string;
  balance?: boolean;
}

export function BaseTokenInput({
  label,
  token,
  left,
  amount,
  onAmountChange,
  simple,
  placeholder,
  balance: showBalance,
}: Props) {
  const balance = useTokenBalance(token);
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAmountChange(e.currentTarget.value);
  };
  const handleMaxClick = () => {
    if (balance) {
      onAmountChange(balance.toExact());
    }
  };

  return (
    <InputWrapper>
      {!simple && (
        <BaseTokenInput.Header
          label={label}
          token={token}
          balance={balance}
          showBalance={showBalance}
        />
      )}
      <Container>
        {left}
        <InputField style={{ flex: 6 }}>
          <StyledInput
            type="number"
            placeholder={placeholder ?? "0.0"}
            min={0}
            onChange={handleAmountChange}
            value={amount}
          />
          {!simple && (
            <React.Fragment>
              <Spacing width={8} />
              <MaxButton onClick={handleMaxClick}>MAX</MaxButton>
            </React.Fragment>
          )}
        </InputField>
      </Container>
    </InputWrapper>
  );
}

BaseTokenInput.Header = function Header({
  label,
  balance,
  token,
  showBalance,
}: {
  label: string;
  balance?: CurrencyAmount<Currency>;
  token?: Currency;
  showBalance?: boolean;
}) {
  const isMobile = useCheckIsMobile();
  // const addToWallet = useAddTokenToWallet(token);

  return (
    <React.Fragment>
      <InputHeader>
        <Label>{label}</Label>
        {showBalance !== false && (
          <TokenBalance>
            Balance{" "}
            {balance != null
              ? commaizeNumber(
                  parseToFixed(
                    Number(balance.toExact()),
                    Math.min(token.decimals, isMobile ? 5 : 6)
                  )
                )
              : "-"}{" "}
            {getClearedSymbol(token)}
            {/* {token.chainId === EVMChainId.ETH_SEPOLIA && !token.isNative && (
            <StyledPlusCircleIcon
              width={16}
              color={colors.orange500}
              strokeWidth={2}
              style={{ marginTop: "-2px" }}
              onClick={addToWallet}
            />
          )} */}
          </TokenBalance>
        )}
      </InputHeader>
      <Spacing height={isMobile ? 8 : 12} />
    </React.Fragment>
  );
};

const Label = styled.span`
  color: #e4e4e5;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 100% */
  ${inDesktop(`
    font-size: 16px;
  `)}
`;

BaseTokenInput.Label = Label;

// function useAddTokenToWallet(token: Currency) {
//   useWalletContext();
//   const wallet = useWallet();
//   const { chainId, library } = useWeb3React();
//   const switchChain = useSwitchChain();

//   return useCallback(() => {
//     if (token.chainId !== chainId) {
//       return switchChain(token.chainId);
//     }
//     registerTokenToWallet(
//       library.provider,
//       token.wrapped.address,
//       token.symbol,
//       token.decimals,
//       `${window.origin}${tokens[token.symbol].icon}`
//     );
//   }, [token, library, chainId]);
// }

const InputWrapper = styled.div`
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${inDesktop(`
    gap: 16px;
    flex-direction: row;
    align-items: stretch;
  `)}
`;

export const InputHeader = styled(Flex.CenterVertical)`
  justify-content: space-between;
  align-items: stretch;
  color: #495057;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`;
export const TokenBalance = styled(Flex.CenterVertical)`
  color: #9e9ea4;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 106.667% */
  ${inDesktop(`
    font-size: 15px;
  `)}
`;
