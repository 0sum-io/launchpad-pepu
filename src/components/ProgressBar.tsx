import { Flex } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { CSSProperties } from "react";
import { animated, useSpring } from "react-spring";

interface Props {
  value: number;
  dark?: boolean;
  label?: boolean;
  size?: number;
  style?: CSSProperties;
  indicatorStyle?: CSSProperties;
  holderStyle?: CSSProperties;
}

export function ProgressBar({
  value,
  dark,
  size = 4,
  label,
  style,
  holderStyle,
  indicatorStyle,
}: Props) {
  const animationStyle = useSpring({
    from: { width: "0%" },
    to: { width: `${value || 0}%` },
    delay: 500,
  });
  return (
    <Container style={style}>
      <ProgressHolder size={size} style={holderStyle}>
        <ProgressIndicator
          value={value}
          style={{ ...animationStyle, ...indicatorStyle }}
        />
      </ProgressHolder>
    </Container>
  );
}

const Container = styled(Flex.CenterVertical)`
  flex: 1;
`;

const ProgressHolder = styled.div<{ size: number }>`
  background: #252525;
  flex: 1;
  height: ${(p) => p.size}px;
  overflow: hidden;
`;

const ProgressIndicator = styled(animated.div)<{ value: number }>`
  background: ${process.env.NEXT_PUBLIC_COLOR}; 
  height: 100%;
  width: ${(p) => p.value}%;
`;
