import { Flex, inDesktop, Spacing } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { useState } from "react";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { TopTraders } from "./TopTraders";
import dynamic from 'next/dynamic';

const Stats24H = dynamic(() => import('./Stats24H'), {
  loading: () => <p>Loading...</p>, // Optional fallback while loading
});

const BondedTokens = dynamic(() => import('./BondedTokens'), {
  loading: () => <p>Loading...</p>, // Optional fallback while loading
});

const MainPageStatistics = () => {
  // const [tab, setTab] = useState<"24H">("24H");
  const [tab, setTab] = useState<"24H" | "Bonded">("24H");

  return (
    <div>
      <Spacing height={20} width={8} />
      <Container>
        {/* <Flex.CenterVertical style={{ width: "100%", marginLeft: "auto" }}> */}
        <div style={{ display: "flex" }}>
          <TabItem active={tab === "24H"} onClick={() => setTab("24H")} style={{ marginRight: "40px" }}>
            Top Tokens
          </TabItem>
          <TabItem active={tab === "Bonded"} onClick={() => setTab("Bonded")}>
            Bonded
          </TabItem>
        </div>
        {/* </Flex.CenterVertical> */}
        <TableContainer>
          {tab === "24H" ? (
            <Stats24H />
          ) : (
            <BondedTokens />
          )}
        </TableContainer>
      </Container>
    </div>
  );
};

export default MainPageStatistics;

const Container = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0px 24px 32px 24px;
  ${inDesktop(`
    width: 70%;
    font-size: 16px;
  `)}
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
      ? `2px solid #fff`
      : "1px solid #757575"};
  color: ${(p) => (p.active ? "#fff" : "#757575")};
  font-size: 14px;
  font-weight: 700;
  height: 57px;
  max-width: 200px;
    ${inDesktop(`
    font-size: 24px;
    padding: 0px 22px;
  `)}
`;

const TableContainer = styled.div`
  padding: 24px 32px;
  overflow-x: auto;
`;