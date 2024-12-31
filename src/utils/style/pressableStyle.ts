import { adaptiveColors } from "@boxfoxs/bds-common";

export const pressableStyle = {
  background: (background = adaptiveColors.gray100) => `
    transition: background 250ms;
    &:active {
      background: ${background};
    }
  `,
  opacity: (opacity = 0.7) => `
    transition: opacity 200ms;
    &:active {
      opacity: ${opacity};
    }
  `,
  scale: (scale = 0.97) => `
    transition: transform 150ms;
    &:active {
      transform: scale(${scale});
    }
  `,
};
