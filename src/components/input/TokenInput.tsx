import { colors } from "@boxfoxs/bds-common";
import { Flex, inDesktop, Spacing, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Currency, Token } from "@sushiswap/core-sdk";
import { SkeletonView } from "components/SkeletonView";
import { chains } from "constants/chains";
import { EVMChainId } from "models/ChainId";
import { ComponentProps } from "react";
import { getClearedSymbol, getTokenIcon } from "utils/checkIsNative";
import { BaseTokenInput, InputHeader, TokenBalance } from "./BaseTokenInput";

interface Props {
  label?: string;
  token: Currency;
  onTokenChange?: (token: Token) => void;
  amount: number | string;
  onAmountChange?: (value: string) => void;
  simple?: boolean;
  balance?: boolean;
}

export function TokenInput({ token, onTokenChange, ...rest }: Props) {
  return (
    <BaseTokenInput
      left={<SelectTokenButton token={token} onChange={onTokenChange} />}
      {...rest}
      token={token}
    />
  );
}

export function SelectTokenButton({
  token,
  onChange,
  ...props
}: Omit<ComponentProps<typeof SelectButton>, "onChange"> & {
  token?: Currency;
  onChange?: (token: Token) => void;
}) {
  const isMobile = useCheckIsMobile();

  return token ? (
    <SelectButton {...props}>
      <TokenIconBox>
        <TokenIcon src={getTokenIcon(token)} alt="token" />
        {![EVMChainId.CHAIN].includes(token.chainId) ? (
          <ChainIcon src={chains[token.chainId].icon} />
        ) : undefined}
      </TokenIconBox>
      <TokenSymbol>{getClearedSymbol(token)}</TokenSymbol>
      <Spacing flex={1} />
      {onChange && (
        //temp
        <ChevronDownIcon width={isMobile ? 16 : 24} color={"#9E9EA4"} />
      )}
    </SelectButton>
  ) : (
    <SelectButton {...props}>
      <TokenIconBox>
        <TokenIcon src={process.env.NEXT_PUBLIC_LOGO} alt="token" />
        {![EVMChainId.CHAIN].includes(token.chainId) ? (
          <ChainIcon src={chains[token.chainId].icon} />
        ) : undefined}
      </TokenIconBox>
      <span>Select a Token</span>
      <ChevronDownIcon width={isMobile ? 16 : 24} color={"#9E9EA4"} />
    </SelectButton>
  );
}

const SelectButton = styled.button`
  border-radius: 8px;
  background: #272727;
  color: #e4e4e5;
  display: flex;
  padding: 12px 16px;
  height: 56px;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  min-width: 180px;
  ${inDesktop(`
    height: 62px;
  `)}
`;

const TokenIcon = styled.img`
  border-radius: 100%;
  border: 1px solid #dee2e6;
  background: #fff;
  width: 32px;
  height: 32px;
  ${inDesktop(`
    width: 38px;
    height: 38px;
  `)}
`;

const TokenSymbol = styled.span`
  font-weight: 700;
  font-size: 15px;
  margin-left: 12px;
  margin-right: 16px;
  width: 50px;
  text-align: left;
  ${inDesktop(`
    font-size: 16px;
  `)}
`;

const TokenIconBox = styled(Flex.Center)`
  border-radius: 100%;
  border: 1px #dee2e6;
  background: #fff;
  position: relative;
  padding: 2px;
`;

const ChainIcon = styled.img`
  width: 18px;
  height: 18px;
  position: absolute;
  right: -5px;
  bottom: -5px;
  border: 1px solid ${colors.inverseGray300};
  background: ${colors.inverseGray300};
  border-radius: 4px;
  ${inDesktop(`
    width: 22px;
    height: 22px;
  `)}
`;

TokenInput.Skeleton = ({
  label,
  balance,
}: {
  label?: string;
  balance?: boolean;
}) => (
  <div>
    <InputHeader>
      <Label>{label}</Label>
      {balance !== false && <TokenBalance>Balance -</TokenBalance>}
    </InputHeader>
    <Spacing height={12} />
    <Flex.CenterVertical>
      <SkeletonView
        height={62}
        style={{ flex: 1, minWidth: "170px", maxWidth: `224px` }}
      />
      <Spacing width={16} />
      <SkeletonView height={62} style={{ flex: 8 }} />
    </Flex.CenterVertical>
  </div>
);

const Label = styled.span`
  color: #e4e4e5;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 100% */
`;
