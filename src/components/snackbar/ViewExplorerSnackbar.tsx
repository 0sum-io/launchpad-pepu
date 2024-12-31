import { Flex, Spacing } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { chains } from "constants/chains";
import { ChainId, EVMChainId } from "models/ChainId";
import React, { ReactNode, useCallback } from "react";
import { useSnackbar } from "./hooks";

export function ViewExplorer({
  hash,
  chainId,
}: {
  hash: string;
  chainId: ChainId;
}) {
  const handleExplorer = (hash: string) => {
    const url = chains[chainId].blockExplorerUrls[0];
    const path = "tx";
    window.open(`${url}/${path}/${hash}`);
  };

  return (
    <React.Fragment>
      <div>
        <Spacing height={4} />
        <StyledButton onClick={() => handleExplorer(hash)}>
          View on explorer
        </StyledButton>
      </div>
    </React.Fragment>
  );
}

const StyledButton = styled(Flex.CenterVertical)`
  color: lightgray;
  font-size: 11px;
  line-height: 11px;
  text-decoration: underline;
  cursor: pointer;
`;

export function useTransactionResultSnackbar() {
  const snackbar = useSnackbar();
  const makeContent = useCallback(
    (
      content: ReactNode,
      hash: string,
      chainId: ChainId = EVMChainId.CHAIN
    ) => (
      <React.Fragment>
        {content}
        <ViewExplorer hash={hash} chainId={chainId} />
      </React.Fragment>
    ),
    []
  );
  const confirm = useCallback(
    (content: ReactNode, hash: string, chainId?: ChainId, duration?: number) =>
      snackbar.warn(makeContent(content, hash, chainId), duration),
    [snackbar.warn]
  );
  const success = useCallback(
    (content: ReactNode, hash: string, chainId?: ChainId, duration?: number) =>
      snackbar.success(makeContent(content, hash, chainId), duration),
    [snackbar.success]
  );
  const pending = useCallback(
    (content: ReactNode, hash: string, chainId?: ChainId, duration?: number) =>
      snackbar.pending(makeContent(content, hash, chainId), duration),
    [snackbar.pending]
  );
  const fail = useCallback(
    (content: ReactNode, hash: string, chainId?: ChainId, duration?: number) =>
      snackbar.fail(makeContent(content, hash, chainId), duration),
    [snackbar.fail]
  );

  return { ...snackbar, confirm, success, pending, fail };
}
