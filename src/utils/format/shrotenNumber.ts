import { commaizeNumber } from "@boxfoxs/utils";

const POINTS = {
  T: 1000000000000,
  B: 1000000000,
  M: 1000000,
  K: 1000,
};

export function shrotenNumber(value: number, startPoint?: string) {
  for (const [name, point] of Object.entries(POINTS)) {
    if (value >= point) {
      return `${commaizeNumber(Math.floor(value / point))}${name}`;
    }
    if (name === startPoint) {
      break;
    }
  }
  return commaizeNumber(value);
}
