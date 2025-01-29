import { colors } from "@boxfoxs/bds-common";
import { Flex, Spacing, Text } from "@boxfoxs/bds-web";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { chains } from "constants/chains";
import { useSwapHistory } from "containers/launchpad/hooks";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import { useTokenInfo } from "hooks/on-chain";
import { useCEXPrice } from "hooks/on-chain/useCEXPrice";
import { useState } from "react";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { checkIsNative, getClearedSymbol } from "utils/checkIsNative";
import { formatDecimals, shortenAddress } from "utils/format";
import { pressableStyle } from "utils/style";

export function TXNS({ data }: { data: ParsedPresale }) {
  const [page, setPage] = useState(1);
  const history = useSwapHistory(data, page);
  const tokenInfo = useTokenInfo(data.chainId, data.paymentToken);
  // const prices = useCEXPrice();
  // const price = prices?.[tokenInfo.data?.symbol] || 0;

  return (
    <div>
      <table style={{ width: "100%", minWidth: "748px", borderSpacing: 0 }}>
        <thead>
          <tr>
            <TableHeader>Time</TableHeader>
            <TableHeader>
              <Flex.CenterVertical>
                Type
                {/* <Spacing width={4} />
              <button>
                <ChevronDownIcon width={16} color="#9e9ea4" />
              </button> */}
              </Flex.CenterVertical>
            </TableHeader>
            {/* <TableHeader>
              <Flex.CenterVertical>
                USD
                <Spacing width={4} />
              <button>
                <img
                  src="/images/ic_chevron_grabber_horizontal.svg"
                  width={16}
                  alt="grabber"
                />
              </button>
              </Flex.CenterVertical>
            </TableHeader> */}
            <TableHeader>
              <Flex.CenterVertical>
                {process.env.NEXT_PUBLIC_CHAIN_SYMBOL}
                {/* <Spacing width={4} />
              <button>
                <img
                  src="/images/ic_chevron_grabber_horizontal.svg"
                  width={16}
                  alt="grabber"
                />
              </button> */}
              </Flex.CenterVertical>
            </TableHeader>
            <TableHeader>
              <Flex.CenterVertical>
                {data.symbol}
                {/* <Spacing width={4} />
              <button>
                <img
                  src="/images/ic_chevron_grabber_horizontal.svg"
                  width={16}
                  alt="grabber"
                />
              </button> */}
              </Flex.CenterVertical>
            </TableHeader>
            <TableHeader>Maker</TableHeader>
            <TableHeader>TXN</TableHeader>
          </tr>
        </thead>
        <tbody>
          {!history.data?.length ? (
            <Spacing height={56} />
          ) : (
            history.data?.map((item) => {
              const amount0IsNative = checkIsNative(
                data.chainId,
                item.pool.token0.id
              );
              const isSell = amount0IsNative
                ? item.amount0 < 0
                : item.amount1 < 0;
              return (
                <TableBodyRow key={item.transaction.id}>
                  <TableBody>{getTimeLabel(item.timestamp)}</TableBody>
                  <TableBody>{isSell ? "Sell" : "Buy"}</TableBody>
                  <TableBody>
                    {commaizeNumber(
                      formatDecimals(
                        Math.abs(amount0IsNative ? item.amount0 : item.amount1),
                        4
                      )
                    )}
                  </TableBody>
                  <TableBody>
                    {commaizeNumber(
                      formatDecimals(
                        Math.abs(amount0IsNative ? item.amount1 : item.amount0),
                        4
                      )
                    )}
                  </TableBody>
                  <TableBody>
                    {shortenAddress(item.origin, 4).replace("0x", "")}
                  </TableBody>
                  <TableBody>
                    <a
                      href={`${chains[data.chainId].blockExplorerUrls[0]}/tx/${
                        item.transaction.id
                      }`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src="/images/ic_expand_window.svg"
                        alt="expand"
                        width={14}
                      />
                    </a>
                  </TableBody>
                </TableBodyRow>
              );
            })
          )}
        </tbody>
      </table>
      <Spacing height={8} />
      <Flex.Center>
        <LeftButton
          onClick={() => page > 1 && setPage((prev) => prev - 1)}
          width={18}
          color={page > 1 ? colors.white : colors.gray600}
        />
        <Text size="base" color={colors.white} center style={{ width: "50px" }}>
          {page}
        </Text>
        <RightButton
          onClick={() => history.hasNext && setPage((prev) => prev + 1)}
          width={18}
          color={history.hasNext ? colors.white : colors.gray600}
        />
      </Flex.Center>
    </div>
  );
}

const TableHeader = styled.th`
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
  text-align: left;
`;

const TableBodyRow = styled.tr`
  :last-child td {
    border-bottom: none;
  }
`;

const TableBody = styled.td<{ width?: number }>`
  padding: 16px 0;
  color: #fff;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  width: ${(p) => p.width}px;
  border-bottom: 1px solid #272727;
`;

const LeftButton = styled(ChevronLeftIcon)`
  cursor: pointer;
  ${pressableStyle.opacity()}
`;
const RightButton = styled(ChevronRightIcon)`
  cursor: pointer;
  ${pressableStyle.opacity()}
`;

function getTimeLabel(timestamp: number) {
  const time = new Date(timestamp * 1000);
  const now = new Date();

  const days = Math.abs(Math.floor(differenceInDays(now, time)));
  const hours = Math.abs(Math.floor(differenceInHours(now, time))) % 24;
  const minutes = Math.abs(Math.floor(differenceInMinutes(now, time))) % 60;
  const seconds = Math.abs(Math.floor(differenceInSeconds(now, time))) % 60;

  if (days > 0) {
    return `${days}d ${hours}h ago`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ago`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s ago`;
  }
  return `${seconds}s ago`;
}
