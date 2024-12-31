import { Flex, Spacing } from "@boxfoxs/bds-web";
import { useBooleanState } from "@boxfoxs/core-hooks";
import { sleep } from "@boxfoxs/utils";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { PendingLottie } from "components/lotties/PendingLottie";
import React, {
  ForwardedRef,
  ReactNode,
  useImperativeHandle,
  useState,
} from "react";
import { animated, useSpring } from "react-spring";
import { pressableStyle } from "utils/style";

export type SnackBarType = "confirm" | "pending" | "success" | "fail";

interface SnackBarProps {
  type: SnackBarType;
  children: ReactNode;
  duration?: number;
  onClose: () => void;
}
export const SnackBar = React.memo(
  React.forwardRef(function SnackBar(
    { type, children, duration, onClose }: SnackBarProps,
    ref: ForwardedRef<{ close: () => void }>
  ) {
    const [isVisible, , hide] = useBooleanState(true);
    const [height, setHeight] = useState(0);
    const spring1 = useSpring({
      from: { height: isVisible ? 0 : height + 10 },
      to: { height: isVisible ? height + 10 : 0 },
    });
    const spring = useSpring({
      from: { transform: `translateX(${isVisible ? 120 : 0}%)` },
      to: { transform: `translateX(${isVisible ? 0 : 120}%)` },
      onResolve: () => {
        if (!isVisible) {
          onClose();
        } else if (!!duration) {
          sleep(duration).then(hide);
        }
      },
    });

    useImperativeHandle(ref, () => ({ close: hide }), []);

    return (
      <Container style={{ height: spring1.height.to((h) => `${h}px`) }}>
        <animated.div style={spring}>
          <SnackBarContainer
            type={type}
            onClick={hide}
            ref={(el) => el && setHeight(el.clientHeight)}
          >
            <IconWrapper>
              {type === "pending" ? (
                <PendingLottie width={12} />
              ) : (
                <img
                  src={`/images/snackbar-${type}.svg`}
                  alt="snackbar-icon"
                />
              )}
            </IconWrapper>
            <Spacing width={16} />
            <SnackBarText>{children}</SnackBarText>
            <Spacing width={8} />
            {!!duration && (
              <ProgressBarContainer>
                <ProgressBar duration={duration} />
              </ProgressBarContainer>
            )}
          </SnackBarContainer>
        </animated.div>
      </Container>
    );
  }),
  () => false
);

const bgGenerator = (type: SnackBarType) => {
  let color = "";
  if (type === "pending") {
    color = "#0085FF";
  } else if (type === "success") {
    color = "#1C8F1A";
  } else if (type === "fail") {
    color = "#F00601";
  } else if (type === "confirm") {
    color = "#F17B01";
  }
  return color;
};

const Container = styled(animated.div)`
  position: relative;
  width: 300px;
`;

const SnackBarContainer = styled.div<{ type: SnackBarType }>`
  position: absolute;
  display: flex;
  align-items: center;
  right: 0;
  border-radius: 4px;
  padding: 16px 24px;
  background: ${({ type }) => bgGenerator(type)};
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  ${pressableStyle.scale(0.95)}
`;

const IconWrapper = styled(Flex.Center)`
  background-color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50px;
`;

const SnackBarText = styled.div`
  color: #fff;
`;

const ProgressBarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: #00000030;
  width: 100%;
`;

const progress = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const ProgressBar = styled.div<{ duration?: number }>`
  background-color: rgba(255, 255, 255, 0.9);
  height: 100%;
  width: 100%;
  animation: ${progress} ${(p) => p.duration}ms;
`;
