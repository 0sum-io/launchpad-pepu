import { useCheckIsMobile, Spacing, inDesktop, Flex } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { chains } from "constants/chains";
import { EVMChainId } from "models/ChainId";

export function NetworkButton({
  chainId,
  active,
  onClick,
  size = "normal",
  mode = "border",
}: {
  chainId: EVMChainId;
  active?: boolean;
  onClick?: () => void;
  size?: "tiny" | "small" | "normal";
  mode?: "opacity" | "border";
}): JSX.Element {
  const isMobile = useCheckIsMobile();
  const chain = chains[chainId];
  return (
    <StyledNetworkButton
      key={chain.chainName}
      active={active}
      onClick={onClick}
      size={size}
      mode={mode}
    >
      <NetworkIcon size={size}>
        <img
          src={chain.icon}
          alt={chain.chainName}
          width={isMobile ? 12 : 24}
        />
      </NetworkIcon>
      <Spacing width={isMobile ? 8 : 12} />
      {chain.chainName}
    </StyledNetworkButton>
  );
}

const StyledNetworkButton = styled.button<{
  active?: boolean;
  size?: keyof typeof SIZE_MAP;
  mode?: "opacity" | "border";
}>`
  border-radius: 8px;
  border: 1px solid
    ${(p) => (p.active && p.mode === "border" ? "#ff844b" : "#454545")};
  opacity: ${(p) => (!p.active && p.mode === "opacity" ? 0.6 : 100)};
  background: ${(p) => (p.active ? "rgba(255, 111, 37, 0.05)" : "#272727")};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) => ({ tiny: "6px", small: "8px", normal: "13px" }[p.size])};
  flex: 1;
  color: #fff;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  word-break: keep-all;
  white-space: nowrap;
  ${(p) =>
    inDesktop(`
    justify-content: start;
    font-size: 16px;
    padding: ${
      { tiny: "8px 10px", small: "13px", normal: "13px 20px" }[p.size]
    };
`)}
`;

const NetworkIcon = styled(Flex.Center)<{ size?: keyof typeof SIZE_MAP }>`
  border-radius: 50%;
  border: 2px solid #dee2e6;
  background: #fff;
  img {
    border-radius: 100%;
    width: ${(p) => MOBILE_SIZE_MAP[p.size]};
    height: ${(p) => MOBILE_SIZE_MAP[p.size]};
  }
  ${(p) =>
    inDesktop(`
    img {
        width: ${SIZE_MAP[p.size]};
        height: ${SIZE_MAP[p.size]};
    }
    `)}
`;

const SIZE_MAP = {
  tiny: "22px",
  small: "22px",
  normal: "28px",
};

const MOBILE_SIZE_MAP = {
  tiny: "16px",
  small: "16px",
  normal: "24px",
};

NetworkButton.Container = StyledNetworkButton;
