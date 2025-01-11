import {
  Flex,
  inDesktop,
  Spacing,
  Text,
  useCheckIsMobile,
} from "@boxfoxs/bds-web";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { getClearedSymbol } from "utils/checkIsNative";
import { formatDecimals } from "utils/format";

interface Props {
  icon?: string;
  symbol: string;
  balance?: number;
  value?: string;
  onChange: (value?: string) => void;
}

export function TokenInput({ icon, symbol, balance, value, onChange }: Props) {
  const isMobile = useCheckIsMobile();

  return (
    <div>
      <Flex.CenterVertical>
        <Txt style={{ fontSize: "14px", fontWeight: "500" }}>You pay</Txt>
        <Spacing flex={1} />
        <Txt>Balance</Txt>
        <Spacing width={4} />
        <Txt style={{ fontSize: "16px", fontWeight: "700" }}>{commaizeNumber(formatDecimals(balance, 5))}</Txt>
      </Flex.CenterVertical>
      <Spacing height={8} />
      <Container>
        <TokenIcon>
          <img src={icon} alt="" />
        </TokenIcon>
        <Spacing width={12} />
        <Text
          color="#fff"
          weight={"bold"}
          style={{ fontSize: isMobile ? "14px" : "16px", width: "50px" }}
        >
          {getClearedSymbol(symbol || "-")}
        </Text>
        <StyledInput
          placeholder="0"
          value={String(value).replace(/[^0-9.]/g, "")}
          onChange={(e) => onChange(e.target.value || undefined)}
        />
        <Spacing width={12} />
        <MaxButton onClick={() => onChange(String(formatDecimals(balance, 5)))}>
          MAX
        </MaxButton>
      </Container>
    </div>
  );
}

const Container = styled(Flex.CenterVertical)`
  position: relative;
  border-radius: 16px;
  background: #272727;
  padding: 0 16px;
  height: 62px;
`;

const TokenIcon = styled(Flex.Center)`
  border-radius: 100%;
  img {
    height: 18px;
    width: 18px;
    border-radius: 100%;
    object-fit: cover;
    object-position: center;
  }
  ${inDesktop(`
    width: 18px;
    height: 18px;
  `)}
`;

const StyledInput = styled.input`
  background-color: transparent;
  font-family: Grandstander;
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: right;
  min-width: 0;
  width: 100%;
  flex: 1;
  ${inDesktop(`
    font-size: 24px;
    font-weight: 700;
    width: 120px;
  `)}
`;

const MaxButton = styled.button`
  color: #fff;
  text-align: center;
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border-radius: 24px;
  border: 1px solid var(--primary-1, ${process.env.NEXT_PUBLIC_COLOR});
  padding: 7px 15px;
  ${inDesktop(`
    padding: 9px 15px;
  `)}
`;

const Txt = styled.div`
  color: #fff;
  font-family: Grandstander;
  margin-top: 4px;
  margin-bottom: 8px;
`;
