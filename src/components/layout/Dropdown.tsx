import React, {
  ComponentProps,
  CSSProperties,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { colors } from "@boxfoxs/bds-common";
import { PortalConsumer } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import {
  useWindowEvent,
  useWindowResizeEvent,
  useWindowScrollEvent,
} from "hooks/common";
import { animated, useSpring } from "react-spring";

interface Props extends ComponentProps<"div"> {
  open?: boolean;
  onClose?: () => void;
  children: ReactNode;
  parent?: RefObject<HTMLElement>;
  position?: DropdownPosition;
}

export function Dropdown({
  open,
  onClose,
  children,
  parent,
  position,
  ...props
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const layout = useDropdownLayout(
    open,
    parent || containerRef,
    dropdownRef,
    position
  );
  useWindowEvent(
    "mousedown",
    (e: Event) => {
      if (!onClose) {
        return;
      }
      const target = e.target as HTMLElement;
      const parent2 = parent?.current ?? containerRef.current;
      const container = dropdownRef.current;
      if (
        parent2?.contains(target) ||
        parent2?.isSameNode(target) ||
        container?.contains(target) ||
        container?.isSameNode(target)
      ) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      onClose();
    },
    { capture: true }
  );

  return (
    <div ref={containerRef}>
      <PortalConsumer>
        <AnimatedDropdown open={open}>
          <DropdownContainer
            ref={dropdownRef}
            {...props}
            style={{ ...layout, ...props.style }}
          >
            {children}
          </DropdownContainer>
        </AnimatedDropdown>
      </PortalConsumer>
    </div>
  );
}

function AnimatedDropdown({
  open,
  children,
}: {
  open?: boolean;
  children: ReactNode;
}) {
  const [prev, setPrev] = useState(false);
  const isFadeIn = !prev && open;
  const animation = useSpring(
    prev !== open
      ? {
          from: { opacity: isFadeIn ? 0 : 1 },
          to: { opacity: isFadeIn ? 1 : 0 },
          onResolve: () => setPrev(!!open),
          config: {
            duration: 200,
          },
        }
      : {}
  );
  if (!open && !prev) {
    return <React.Fragment />;
  }
  return (
    <animated.div style={{ opacity: animation.opacity }}>
      {children}
    </animated.div>
  );
}

const DropdownContainer = styled.div`
  position: fixed;
  z-index: 10;
  margin-top: 8px;
  overflow: auto;
  background: ${colors.white};
  border-radius: 8px;
  box-shadow: 0px 24px 48px 0px rgba(0, 0, 0, 0.22);
`;

function useDropdownLayout(
  use?: boolean,
  containerRef?: RefObject<HTMLElement>,
  contentRef?: RefObject<HTMLElement>,
  position?: DropdownPosition
) {
  const [layout, setLayout] = useState<CSSProperties>({});

  const updateLayout = useCallback(() => {
    const parent = containerRef?.current?.parentElement;
    if (!parent || use === false || !contentRef?.current) {
      return;
    }
    const rect = parent.getBoundingClientRect();
    const rect2 = contentRef.current.getBoundingClientRect();
    const maxX = window.innerWidth;
    setLayout({
      top: rect.top + rect.height,
      minWidth: rect.width,
    });
    if (!position || position === "left") {
      const x1 = rect.x + rect2.width + 24;
      const left = maxX >= x1 ? rect.x : maxX - 24 - rect2.width;
      setLayout((prev) => ({ ...prev, left }));
    } else {
      const x1 = rect.x + rect.width;
      const right = x1 + rect2.width < 0 ? 24 : window.innerWidth - x1;
      setLayout((prev) => ({ ...prev, right }));
    }
  }, [use]);
  useWindowResizeEvent(updateLayout);
  useWindowScrollEvent(updateLayout, { capture: true });
  useEffect(() => {
    updateLayout();
  }, [use]);
  return layout;
}

export type DropdownPosition = "left" | "right";
