import styled from "@emotion/styled";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";

export function DefinedChart({ data }: { data: ParsedPresale }) {
  return (
    <Iframe
      height="100%"
      width="100%"
      id="defined-embed"
      title="Defined Embed"
      src={`https://www.defined.fi/base/${data.token}?quoteToken=token0&embedded=1&hideTxTable=1&hideSidebar=1&hideChart=0&hideChartEmptyBars=1&embedColorMode=DARK`}
      frameBorder="0"
      allow="clipboard-write"
    />
  );
}

const Iframe = styled.iframe`
  width: 100%;
  border: none;
  height: 600px;
`;
