import { useMemo } from "react";
import { addressIsSame } from "utils/addressIsSame";
import { usePools } from "./usePools";
import { useSort, usePresaleList, useOrder } from "./usePresaleList";

export function useSortedPresaleList() {
  const presales = usePresaleList();
  const [sort] = useSort();
  const [order] = useOrder();
  const volumes = usePools();
  const sortedPresales = useMemo(() => {
    if (!presales.data) {
      return [];
    }
    if (sort === "CREATE_ORDER" && order === "desc") {
      return [...presales.data].sort(
        (a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)
      );
    }
    if (sort === "CREATE_ORDER" && order === "asc") {
      return [...presales.data].sort(
        (a, b) => Number(a.blockTimestamp) - Number(b.blockTimestamp)
      );
    }
    if (!volumes.data) {
      return [...presales.data];
    }
    const withMC = presales.data.map((i) => {
      const data = volumes.data.find((v) => addressIsSame(v.id, i.pairAddress));
      const mc = addressIsSame(data.token0.id, i.token)
        ? data.volumeToken1
        : data.volumeToken0;
      return { ...i, mc };
    });
    if (sort === "MARKET_CAP" && order === "asc") {
      return withMC.sort((a, b) => Math.abs(a.mc) - Math.abs(b.mc));
    }
    if (sort === "MARKET_CAP" && order === "desc") {
      return withMC.sort((a, b) => Math.abs(b.mc) - Math.abs(a.mc));
    }
  }, [sort, order, presales.data]);
  return sortedPresales;
}
