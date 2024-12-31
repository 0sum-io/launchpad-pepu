import { Flex, useCheckIsMobile } from "@boxfoxs/bds-web";
import { useBooleanState } from "@boxfoxs/core-hooks";
import { convertNewlineToJSX } from "@boxfoxs/react-web";
import styled from "@emotion/styled";
import { ReactNode } from "react";

export function TooltipButton({
  position = "right",
  content,
}: {
  position?: "right" | "left";
  content: ReactNode;
}) {
  const isMobile = useCheckIsMobile();
  const [isOpen, open, close, toggle] = useBooleanState();

  return (
    <Wrapper
      onMouseEnter={isMobile ? undefined : open}
      onMouseLeave={isMobile ? undefined : close}
    >
      <button onClick={toggle}>
        <img src="/images/ic_information_circle.svg" alt="i" />
      </button>
      {isOpen && (
        <Tooltip position={position}>
          {typeof content === "string" ? convertNewlineToJSX(content) : content}
        </Tooltip>
      )}
    </Wrapper>
  );
}

const Wrapper = styled(Flex.Center)`
  position: relative;
`;

const Tooltip = styled.div<{ position?: "left" | "right" }>`
  padding: 16px;
  position: absolute;
  ${(p) => (p.position === "right" ? `left: -16px;` : "right: -16px;")}
  bottom: calc(100% + 9px);
  border-radius: 16px;
  border: 1px solid #272727;
  background: #1c1c1c;
  backdrop-filter: blur(30px);
  white-space: nowrap;
  color: #9e9ea4;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px; /* 126.667% */
  letter-spacing: -0.1px;
`;
