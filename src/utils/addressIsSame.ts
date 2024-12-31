import { uniqBy } from "lodash";

export function addressIsSame(...addresses: (string | null | undefined)[]) {
  if (addresses.some((i) => !i)) {
    return false;
  }
  return uniqBy(addresses, (i) => i?.toLowerCase()).length === 1;
}
