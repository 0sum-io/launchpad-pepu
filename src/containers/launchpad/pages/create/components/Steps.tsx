import React from "react";
import { List } from "components/layout";
import { ConnectButton } from "components/Button";
import { Flex, Spacing } from "@boxfoxs/bds-web";
import { ChainInput, Label, StyledTextArea } from "./Components";
import { useCreatePresaleState } from "../hooks/useCreateStore";
import { selectImageFile } from "utils/selectImageFile";
import { useThirdWeb } from "components/provider/ThirdWebProvider";
import { useMakePresale } from "containers/launchpad/hooks";
import { useAccount, useSupportChain } from "hooks/on-chain";
import { colors } from "@boxfoxs/bds-common";
import { useAsyncCallback } from "@boxfoxs/core-hooks";
import styled from "@emotion/styled";
import { uploadImage } from "remotes/uploadImage";

export function Steps() {
  const form = useCreatePresaleState();
  const [icon, setIcon] =
    React.useState<Awaited<ReturnType<typeof selectImageFile>>>();

  const connect = useThirdWeb();
  const create = useMakePresale();
  const account = useAccount();
  const chain = useSupportChain();

  const cta = useAsyncCallback(async () => {
    if (!account) {
      connect();
      return;
    }
    if (chain.walletChainId !== form.value.network) {
      chain.switch(form.value.network);
      return;
    }
    const error = {
      name: form.value.name ? false : "Please enter a name",
      symbol: form.value.symbol ? false : "Please enter a symbol",
      websiteUrl:
        !form.value.websiteUrl || form.value.websiteUrl.startsWith("http")
          ? false
          : "Please enter a valid website URL",
      xUrl:
        !form.value.xUrl || form.value.xUrl.startsWith("http")
          ? false
          : "Please enter a valid X URL",
      discordUrl:
        !form.value.discordUrl || form.value.discordUrl.startsWith("http")
          ? false
          : "Please enter a valid Discord URL",
      telegramUrl:
        !form.value.telegramUrl || form.value.telegramUrl.startsWith("http")
          ? false
          : "Please enter a valid Telegram URL",
      icon: icon ? false : true,
    };
    form.setError(error);

    if (!Object.values(error).every((i) => !i)) {
      return;
    }

    if (chain.walletChainId !== form.value.network) {
      chain.switch(form.value.network);
      return;
    }

    const iconUrl = await uploadImage(icon.file);

    await create({
      chainId: form.value.network,
      paymentToken: form.value.paymentToken,
      name: form.value.name,
      symbol: form.value.symbol,
      amountToRaise: 1_000, // Number(form.value.amountToRaise),
      totalSupply: 10_000_000, // form.value.totalSupply,
      amountToSale: 10_000_000, // form.value.totalSupply - form.value.minterAllocation,
      data: {
        websiteUrl: form.value.websiteUrl,
        xUrl: form.value.xUrl,
        telegramUrl: form.value.telegramUrl,
        description: form.value.description,
        iconUrl,
      },
    });
  });

  return (
    <>
      <List divider={<Spacing height={40} />}>
        <div>
          <Label>Name</Label>
          <Spacing height={12} />
          <ChainInput
            placeholder="Token name..."
            value={form.value.name}
            onChange={(e) => form.update({ name: e.currentTarget.value })}
            error={form.error.name}
          />
        </div>
        <div>
          <Label>Ticker</Label>
          <Spacing height={12} />
          <ChainInput
            placeholder="Token ticker..."
            value={form.value.symbol}
            onChange={(e) => form.update({ symbol: e.currentTarget.value })}
            error={form.error.symbol}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Spacing height={12} />
          <StyledTextArea
            placeholder="Token description..."
            value={form.value.description}
            onChange={(e) =>
              form.update({ description: e.currentTarget.value })
            }
          />
        </div>
        <div>
          <Label>Website</Label>
          <Spacing height={12} />
          <ChainInput
            placeholder="https://..."
            value={form.value.websiteUrl}
            onChange={(e) => form.update({ websiteUrl: e.currentTarget.value })}
            error={form.error.websiteUrl}
          />
        </div>
        <div>
          <Label>X / Twitter</Label>
          <Spacing height={12} />
          <ChainInput
            placeholder="https://..."
            value={form.value.xUrl}
            onChange={(e) => form.update({ xUrl: e.currentTarget.value })}
            error={form.error.xUrl}
          />
        </div>
        <div>
          <Label>Telegram</Label>
          <Spacing height={12} />
          <ChainInput
            placeholder="https://..."
            value={form.value.telegramUrl}
            onChange={(e) =>
              form.update({ telegramUrl: e.currentTarget.value })
            }
            error={form.error.telegramUrl}
          />
        </div>

        <div style={{ flex: 1 }}>
          <Label>Token Icon</Label>
          <Spacing height={12} />
          <UploadButton
            onClick={() => selectImageFile().then(setIcon)}
            error={form.error.icon}
          >
            <span>{icon ? icon.name : "Upload"}</span>
            <img src="/images/ic_document.svg" alt="upload" width={20} />
          </UploadButton>
          {icon && <ImagePreview src={icon.data} alt="icon" />}
        </div>
      </List>
      <div>
        <Flex.CenterVertical
          style={{ gap: "16px", marginTop: "32px", justifyContent: "center" }}
        >
          <ConnectButton
            textSize={19}
            rounded={16}
            theme="primary"
            style={{
              height: "62px",
              width: "280px",
            }}
            onClick={cta.callback}
            loading={cta.isLoading}
          >
            {!account
              ? "Connect Wallet"
              : chain.walletChainId !== form.value.network
              ? "Switch Chain"
              : "Create Token"}
          </ConnectButton>
        </Flex.CenterVertical>
      </div>
    </>
  );
}

const UploadButton = styled.button<{ error?: boolean | string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 56px;
  border-radius: 8px;
  background: white;
  color: #62626d;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  width: 100%;
  border: 4px solid ${(p) => (p.error ? colors.red500 : "transparent")};
  span {
    text-overflow: ellipsis;
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* number of lines to show */
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }
`;

const ImagePreview = styled.img`
  width: 150px;
  margin-top: 12px;
  object-fit: contain;
  object-position: center;
`;
