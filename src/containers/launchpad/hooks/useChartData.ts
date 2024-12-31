import { useQuery } from "@tanstack/react-query";
import { LaunchpadQueries } from "remotes/graphql";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { addressIsSame } from "utils/addressIsSame";
import {
  Pool15MinuteData,
  PoolDayData,
} from "../../../../graphql/launchpad/chain";

export const useChartData = (presale: ParsedPresale, unit: ChartDataUnit) => {
  const { data, isLoading, refetch } = useQuery<
    (Pool15MinuteData | PoolDayData)[],
    Error
  >({
    queryKey: ["getChartData", unit, presale.pairAddress],
    queryFn: async () => {
      const data = await LaunchpadQueries[presale.chainId][PATH_BY_UNIT[unit]](
        presale.pairAddress.toLowerCase()
      );
      return data.map((i) => {
        const isInvertPrice = addressIsSame(
          i.pool.token1.id,
          presale.paymentToken
        );
        const inverted = isInvertPrice
          ? {
              ...i,
              close: 1 / i.close,
              open: 1 / i.open,
              high: 1 / i.low,
              low: 1 / i.high,
              token0Price: 1 / i.token1Price,
              token1Price: 1 / i.token0Price,
              volumeToken0: i.volumeToken1,
              volumeToken1: i.volumeToken0,
              isInvertPrice,
            }
          : {
              ...i,
              open: Number(i.open),
              close: Number(i.close),
              low: Number(i.low),
              high: Number(i.high),
              token0Price: Number(i.token1Price),
              token1Price: Number(i.token1Price),
              volumeToken0: i.volumeToken0,
              volumeToken1: i.volumeToken1,
              isInvertPrice,
            };

        return inverted;
      });
    },
    refetchInterval: 5000,
  });

  return { data, isLoading, refetch };
};

export enum ChartDataUnit {
  MINUTE_1,
  MINITE_15,
  MINUTE_30,
  HOUR_1,
  HOUR_4,
  DAY,
}

const PATH_BY_UNIT = {
  [ChartDataUnit.HOUR_1]: "fetchPoolHourDatas",
  [ChartDataUnit.HOUR_4]: "fetchPool4hourDatas",
  [ChartDataUnit.MINITE_15]: "fetchPool15MinuteDatas",
  [ChartDataUnit.MINUTE_1]: "fetchPoolMinuteDatas",
  [ChartDataUnit.DAY]: "fetchPoolDayDatas",
};
