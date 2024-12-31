import { adaptiveColors } from "@boxfoxs/bds-common";
import { inDesktop } from "@boxfoxs/bds-web";

export const hoverableStyle = {
  background: (background = adaptiveColors.gray100) => `
    transition: background 250ms;
    ${inDesktop(`
      &:hover {
        background: ${background};
      }
    `)}
  `,
  opacity: (opacity = 0.7) => `
    transition: opacity 200ms;
    ${inDesktop(`
      &:hover {
        opacity: ${opacity};
      }
    `)}
  `,
  scale: (scale = 0.97) => `
    transition: transform 150ms;
    ${inDesktop(`
      &:hover {
        transform: scale(${scale});
      }
    `)}
  `,
};
