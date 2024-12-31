import React, { ComponentProps } from "react";
import { ReactNode } from "react";
import { animated, easings, useSpring } from "react-spring";

interface Props {
  children?: ReactNode;
  visible?: boolean;
  delay?: number;
}

export function FadeAnimation({ children, visible, delay }: Props) {
  return (
    <FadeOpacityAnimation visible={visible} delay={delay}>
      <FadeDownAnimation>{children}</FadeDownAnimation>
    </FadeOpacityAnimation>
  );
}

export function FadeOpacityAnimation({
  visible,
  delay,
  ...props
}: Props & ComponentProps<typeof animated.div>) {
  const spring = useSpring({
    from: { opacity: 0 },
    to: { opacity: visible !== false ? 1 : 0 },
    config: {
      tension: 150,
      friction: 26,
      precision: 0.01,
      duration: 400,
    },
    delay: delay,
  });
  return (
    <animated.div
      {...props}
      style={{ ...props.style, opacity: spring.opacity }}
    >
      {props.children}
    </animated.div>
  );
}

export function FadeDownAnimation({
  visible,
  delay,
  ...props
}: Props & ComponentProps<typeof animated.div>) {
  const spring = useSpring({
    from: { transform: "translateY(-30px)" },
    to: { transform: `translateY(${visible !== false ? "0%" : "-30px"})` },
    config: {
      tension: 150,
      friction: 26,
      precision: 0.01,
      duration: 400,
      easing: easings.easeOutBack,
    },
    delay: delay,
  });
  return (
    <animated.div
      {...props}
      style={{ ...props.style, transform: spring.transform }}
    >
      {props.children}
    </animated.div>
  );
}
