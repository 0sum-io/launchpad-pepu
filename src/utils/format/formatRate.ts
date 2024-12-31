export function formatRateToPercent(value: number, decimals: number = 0) {
  return (
    Math.floor(value * Math.pow(10, decimals) * 100) / Math.pow(10, decimals)
  );
}
