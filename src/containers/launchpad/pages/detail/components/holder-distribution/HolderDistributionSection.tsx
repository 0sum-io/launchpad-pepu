import { Spacing } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { useHolderList } from "containers/launchpad/hooks";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import { formatDecimals, shortenAddress } from "utils/format";

export function HolderDistributionSection({
  presale,
}: {
  presale: ParsedPresale;
}) {
  const list = useHolderList(presale);

  return (
    <Container>
      <Title>Holder Distribution</Title>
      <Spacing height={10} />
      {list?.map((i, idx) => (
        <Row
          idx={idx}
          address={i.account.address}
          ratio={Math.abs(i.balance / presale.totalSupply) * 100}
        />
      ))}
    </Container>
  );
}

const Container = styled.div``;

const Title = styled.div`
  color: var(--grey-7, #cfcfde);

  /* Xsmall/Xsmall_B */
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
  line-height: 155%; /* 18.6px */
`;

function Row({
  idx,
  address,
  ratio,
}: {
  idx: number;
  address: string;
  ratio: number;
}) {
  return (
    <RowContainer>
      <Text bold={idx == 0}>{idx + 1}.</Text>
      <Text bold={idx == 0}>{shortenAddress(address)}</Text>
      <Text bold={idx == 0}>{formatDecimals(ratio, 1)}%</Text>
    </RowContainer>
  );
}

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 20px 1fr auto;
  grid-gap: 8px;
  margin-bottom: 4px;
`;

const Text = styled.div<{ bold?: boolean }>`
  color: var(--grey-5, #70707e);

  /* Xsmall/Xsmall */
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 155%; /* 18.6px */
  ${(p) =>
    p.bold
      ? `
        color: var(--grey-7, #CFCFDE);
        font-weight: 900;
    `
      : ""}
`;
