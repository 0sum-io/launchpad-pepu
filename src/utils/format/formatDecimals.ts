export function formatDecimals(value: number, decimals = 1) {
  const multiplier = Math.pow(10, decimals);
  return Math.floor(value * multiplier) / multiplier;
}
