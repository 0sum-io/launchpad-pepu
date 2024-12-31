import { Flex, inDesktop, Spacing } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { useState } from "react";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { TXNS } from "./TXNS";
import { TopTraders } from "./TopTraders";

export function StatisticsSection({ presale }: { presale: ParsedPresale }) {
  const [tab, setTab] = useState<"TXNS" | "Traders">("TXNS");

  return (
    <div>
      <Flex.CenterVertical>
        <Spacing width={8} />
      </Flex.CenterVertical>
      <Spacing height={20} />
      <Container className="StatisticsTable">
        <Flex.CenterVertical>
          <TabItem active={tab === "TXNS"} onClick={() => setTab("TXNS")}>
            TXNS
          </TabItem>
          <TabItem active={tab === "Traders"} onClick={() => setTab("Traders")}>
            Top Holders
          </TabItem>
        </Flex.CenterVertical>
        <TableContainer>
          {tab === "TXNS" ? (
            <TXNS data={presale} />
          ) : (
            <TopTraders data={presale} />
          )}
        </TableContainer>
      </Container>
    </div>
  );
}

const Container = styled.div`
  max-width: 814px;

  padding: 24px 24px 32px 24px;
  border-radius: 32px;
  border: 4px solid #272727;
  box-shadow: rgb(0, 0, 0) 4px 4px;
  background: rgb(48, 104, 185);
  backdrop-filter: blur(30px);
`;

const Title = styled.div`
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.1px;
  ${inDesktop(`
    font-size: 16px;
  `)}
`;

export const TabItem = styled.button<{ active?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 24px 16px;
  border-bottom: ${(p) =>
    p.active
      ? `2px solid ${process.env.NEXT_PUBLIC_COLOR}`
      : "1px solid #272727"};
  color: ${(p) => (p.active ? process.env.NEXT_PUBLIC_COLOR : "#fff")};
  font-size: 14px;
  font-weight: 600;
  height: 57px;
  ${inDesktop(`
    height: 71px;
    font-size: 16px;
    padding: 28px 24px 22px;
  `)}
`;

const TableContainer = styled.div`
  padding: 24px 32px;
  overflow-x: auto;
`;
