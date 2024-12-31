import { coerceCssPixelValue } from "@boxfoxs/bds-web";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const skeletonGradient = keyframes`
  0% {
      background-color: rgba(165, 165, 165, 0.1);
  }

  50% {
      background-color: rgba(165, 165, 165, 0.2);
  }

  100% {
      background-color: rgba(165, 165, 165, 0.1);
  }
`;

export const SkeletonView = styled.div<{
  width?: string | number;
  height?: string | number;
}>`
  animation: ${skeletonGradient} 1.8s infinite ease-in-out;
  width: ${(p) => (p.width ? coerceCssPixelValue(p.width) : "100%")};
  height: ${(p) => (p.height ? coerceCssPixelValue(p.height) : "100%")};
  border-radius: 4px;
`;
