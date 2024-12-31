import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { formatEther } from "@ethersproject/units";
import { chains } from "constants/chains";
import { useHolderList } from "containers/launchpad/hooks";
import { orderBy } from "lodash";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { formatDecimals, shortenAddress } from "utils/format";

export function TopTraders({ data }: { data?: ParsedPresale }) {
  const holderList = useHolderList(data);

  return (
    <table style={{ width: "100%", minWidth: "748px", borderSpacing: 0 }}>
      <thead>
        <tr>
          <TableHeader>Rank</TableHeader>
          <TableHeader>Account</TableHeader>
          {/* <TableHeader>Bought</TableHeader>
          <TableHeader>Sold</TableHeader>
          <TableHeader>PNL</TableHeader>
          <TableHeader>Unrealized</TableHeader> */}
          <TableHeader>Balance</TableHeader>
          <TableHeader>EXP</TableHeader>
        </tr>
      </thead>
      <tbody>
        {orderBy(
          holderList,
          (i) => Math.abs(Number(formatEther(i.balance))),
          "desc"
        )
          ?.slice(0, 10)
          .map((item, idx) => (
            <TableBodyRow key={`${item.account}${idx}`}>
              <TableBody>#{idx + 1}</TableBody>
              <TableBody>{shortenAddress(item.account, 4)}</TableBody>
              {/* <TableBody>10.0652</TableBody>
            <TableBody>155.3421</TableBody>
            <TableBody>$0.000054</TableBody>
            <TableBody>$0.0000054</TableBody> */}
              <TableBody>
                {commaizeNumber(
                  formatDecimals(Math.abs(Number(formatEther(item.balance))), 3)
                )}
              </TableBody>
              <TableBody>
                <a
                  href={`${chains[data.chainId].blockExplorerUrls[0]}/address/${
                    item.account
                  }`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/images/ic_expand_window.svg" alt="expand"  width={14} />
                </a>
              </TableBody>
            </TableBodyRow>
          ))}
      </tbody>
    </table>
  );
}

const TableHeader = styled.th`
  color: #9e9ea4;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 114.286% */
  letter-spacing: -0.1px;
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
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
  width: ${(p) => p.width}px;
  border-bottom: 1px solid #272727;
`;
