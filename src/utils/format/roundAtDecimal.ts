export function roundAtDecimal(value: number, decimalPoint: number) {
  const multiplier = 10 ** decimalPoint;
  const multipliedNumber = value * multiplier;
  const roundedNumber = Math.round(multipliedNumber);
  const result = roundedNumber / multiplier;
  return result;
}
