import { Flex } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { AllHTMLAttributes, ReactNode } from "react";
import { hoverableStyle } from "utils/style";
import { LoadingLottie } from "./lotties/LoadingLottie";

interface Props
  extends Omit<AllHTMLAttributes<HTMLButtonElement>, "as" | "type"> {
  theme?: "primary" | "secondary" | "white" | "dark" | "outline" | "graySelect";
  rounded?: boolean | number;
  bold?: boolean | number;
  padding?: string;
  loading?: boolean;
  textSize?: number;
  fullWidth?: boolean;
  children: ReactNode;
}

export function ConnectButton(props: Props) {
  return (
    <StyledButton
      {...props}
      onClick={props.loading ? undefined : props.onClick}
    >
      {props.loading && (
        <Loader theme={props.theme} rounded={props.rounded} style={props.style}>
          <LoadingLottie width={props.textSize * 1.5 || 18} />
        </Loader>
      )}
      {props.children}
    </StyledButton>
  );
}

const Loader = styled(Flex.Center)<Props>`
  position: absolute;
  width: 80%;
  height: 100%;
  border-top: 4px solid black;
  border-bottom: 4px solid black;
  ${(p) => {
    const colorSet = getColorSet(p.theme);
    return `background: ${colorSet.background}`;
  }}
`;

const StyledButton = styled.button<Props>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ rounded }) =>
    rounded === true ? "100%" : (rounded || 40) + "px"};
  font-weight: ${({ bold }) =>
    bold === true || bold === undefined ? 700 : bold || 400};
  font-size: ${({ textSize }) => textSize + "px" || "14px"};
  padding: ${({ padding }) => padding || "16px 18px"};
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  text-wrap: nowrap;
  ${hoverableStyle.scale(1.02)};
  ${(p) => {
    const colorSet = getColorSet(p.theme);
    return `
      color: ${colorSet.color};
      background: ${colorSet.background};
      ${"border" in colorSet ? `border: ${colorSet.border}` : ""};
      &:disabled {
        color: ${colorSet.disabled.color};
        background: ${colorSet.disabled.background};
        ${hoverableStyle.scale(1)};
      }`;
  }};

  border-radius: 32px;
`;

function getColorSet(
  theme: "primary" | "secondary" | "white" | "dark" | "outline" | "graySelect"
) {
  switch (theme) {
    case "primary":
      return {
        color: "#272727",
        background: process.env.NEXT_PUBLIC_COLOR,
        hover: { background: "#45454C" },
        active: { background: "#28282E" },
        disabled: { background: "#3F3F3F" },
        border: `4px solid black`
      };
    case "secondary":
      return {
        color: "#fff",
        background: "#0085FF",
        hover: { background: "#101011" },
        active: { background: "#0085FF" },
        disabled: { color: "#58585F", background: "#28282E" },
      };
    case "white":
      return {
        color: "#fff",
        background: "transparent",
        hover: { background: "#DBDBE3" },
        active: { background: "#fff" },
        disabled: { color: "#58585F", background: "#28282E" },
      };
    case "dark":
      return {
        color: process.env.NEXT_PUBLIC_COLOR,
        background: "#272727",
        hover: { background: "#272727" },
        active: { background: "#272727" },
        disabled: { color: "#58585F", background: "#28282E" },
      };
    case "outline":
      return {
        color: "#fff",
        background: "#trasnparent",
        border: `4px solid #fff`,
        hover: { background: "transparent" },
        active: { background: "transparent" },
        disabled: { color: "#58585F", background: "transparent" },
      };
    case "graySelect":
      return {
        color: "#fff",
        border: `1px solid #454545`,
        background: "#272727",
        disabled: { color: "#fff", background: "#272727" },
      };
    default:
      return {
        color: "#fff",
        background: process.env.NEXT_PUBLIC_COLOR,
        hover: { background: "#45454C" },
        active: { background: "#28282E" },
        disabled: { background: "#3F3F3F" },
      };
  }
}
