export namespace Media {
  export const SIZE = {
    xsm: "350px",
    sm: "640px",
    msm: "820px",
    md: "980px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
    "3xl": "2200px",
  };

  export type BREAK_POINT = keyof typeof SIZE;

  export function screen(size: keyof typeof SIZE) {
    return (style: string) => `@media (min-width: ${SIZE[size]}) {${style}}`;
  }
}
