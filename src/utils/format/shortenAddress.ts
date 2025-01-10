export function shortenAddress(address: string, substring?: number) {
  return (
    address.substring(0, substring || 4) +
    "..." +
    address.substring(
      substring ? address.length - substring : address.length - 4
    )
  );
}
