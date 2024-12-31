import { commaizeNumber } from "@boxfoxs/utils";

export namespace NumberFormat {
  function createNumberFormatter(format: (num: number) => number) {
    return function (value: number, unit: number) {
      if (unit < 1) {
        const reciprocal = 1 / unit;
        return format(value * reciprocal) / reciprocal;
      }
      return format(value / unit) * unit;
    };
  }

  export const ceil = createNumberFormatter(Math.ceil);

  export const floor = createNumberFormatter(Math.floor);

  export const round = createNumberFormatter(Math.round);

  export const commaizWithFallback = (
    value?: string | number,
    options?: {
      decimals?: number;
      fallback?: string;
    }
  ) => {
    if (value == null) {
      return options?.fallback ?? "-";
    }
    return commaizeNumber(value);
  };
}
