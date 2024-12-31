import { Flex, Spacing, inDesktop, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { formatDecimals, shrotenNumber } from "utils/format";
import { formatRateToPercent } from "utils/format/formatRate";

export namespace AssetNameCell {
  export function View({ icon, name }: { icon: string; name: string }) {
    const isMobile = useCheckIsMobile();
    return (
      <Flex.CenterVertical>
        <IconImage src={icon} />
        <Spacing width={6} />
        <span
          style={{
            fontWeight: 700,
            fontSize: isMobile ? 12 : 14,
            lineHeight: "14px",
          }}
        >
          {name}
        </span>
      </Flex.CenterVertical>
    );
  }

  const IconImage = styled.img`
    width: 20px;
    ${inDesktop(`
      width: 24px;
    `)}
  `;
}

export function BalanceCell({ value }: { value: number }) {
  const isMobile = useCheckIsMobile();
  return (
    <span
      style={{
        fontSize: isMobile ? "12px" : "14px",
        lineHeight: "14px",
      }}
    >
      $ {shrotenNumber(formatDecimals(value, 2))}
    </span>
  );
}

export function APYCell({ value }: { value: number }) {
  const isMobile = useCheckIsMobile();
  return (
    <span
      style={{
        fontSize: isMobile ? "12px" : "14px",
        lineHeight: "14px",
      }}
    >
      {formatRateToPercent(value, 2)}%
    </span>
  );
}
