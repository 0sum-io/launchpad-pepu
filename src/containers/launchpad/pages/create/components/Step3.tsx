import { colors } from "@boxfoxs/bds-common";
import { Flex, inDesktop, Spacing, useCheckIsMobile } from "@boxfoxs/bds-web";
import { useAsyncCallback } from "@boxfoxs/core-hooks";
import styled from "@emotion/styled";
import { ConnectButton } from "components/Button";
import { List } from "components/layout";
import { useThirdWeb } from "components/provider/ThirdWebProvider";
import { useMakePresale } from "containers/launchpad/hooks";
import { useAccount, useSupportChain } from "hooks/on-chain";
import { useState } from "react";
import { uploadImage } from "remotes/uploadImage";
import { selectImageFile } from "utils/selectImageFile";
import { pressableStyle } from "utils/style";
import { useCreatePresaleState } from "../hooks/useCreateStore";
import {
  ChainInput,
  Label,
  Step,
  StyledTextArea,
  SubLabel,
  SubTitle,
} from "./Components";

interface Props {
  prevStep: () => void;
}

export function Step3({ prevStep }: Props) {
  const isMobile = useCheckIsMobile();
  const form = useCreatePresaleState();
  const [icon, setIcon] =
    useState<Awaited<ReturnType<typeof selectImageFile>>>();
  const [thumbnail, setThumbnail] =
    useState<Awaited<ReturnType<typeof selectImageFile>>>();

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
    const thumbnailUrl = thumbnail && (await uploadImage(thumbnail.file));

    await create({
      chainId: form.value.network,
      name: form.value.name,
      symbol: form.value.symbol,
      totalSupply: form.value.totalSupply,
      amountToRaise: Number(form.value.amountToRaise),
      paymentToken: form.value.paymentToken,
      amountToSale: form.value.totalSupply - form.value.minterAllocation,
      data: {
        websiteUrl: form.value.websiteUrl,
        xUrl: form.value.xUrl,
        discordUrl: form.value.discordUrl,
        telegramUrl: form.value.telegramUrl,
        description: form.value.description,
        iconUrl,
        thumbnailUrl,
      },
    });
  });

  return (
    <List divider={<Spacing height={isMobile ? 32 : 40} />}>
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
        <Label>Discord</Label>
        <Spacing height={12} />
        <ChainInput
          placeholder="https://..."
          value={form.value.discordUrl}
          onChange={(e) => form.update({ discordUrl: e.currentTarget.value })}
          error={form.error.discordUrl}
        />
      </div>
      <div>
        <Label>Telegram</Label>
        <Spacing height={12} />
        <ChainInput
          placeholder="https://..." 
          value={form.value.telegramUrl}
          onChange={(e) => form.update({ telegramUrl: e.currentTarget.value })}
          error={form.error.telegramUrl}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Spacing height={12} />
        <StyledTextArea
          placeholder=""
          value={form.value.description}
          onChange={(e) => form.update({ description: e.currentTarget.value })}
        />
      </div>
      <Flex.CenterVertical
        direction={isMobile ? "column" : "row"}
        align="stretch"
      >
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
        <Spacing width={24} height={32} />
        <div style={{ flex: 1 }}>
          <Flex.CenterVertical>
            <Label>Thumbnail</Label>
            <Spacing width={10} />
            <SubLabel>Optional</SubLabel>
          </Flex.CenterVertical>
          <Spacing height={12} />
          <UploadButton onClick={() => selectImageFile().then(setThumbnail)}>
            <span>{thumbnail ? thumbnail.name : "Upload"}</span>
            <img src="/images/ic_document.svg" alt="upload" width={20} />
          </UploadButton>
          {thumbnail && <ImagePreview src={thumbnail.data} alt="icon" />}
        </div>
      </Flex.CenterVertical>
      <div>
        <Flex.CenterVertical justify="space-between" style={{ gap: "16px" }}>
          <ConnectButton
            onClick={prevStep}
            textSize={19}
            rounded={16}
            theme="outline"
            style={{
              height: isMobile ? "54px" : "62px",
              width: isMobile ? "" : "160px",
              flex: 1,
            }}
          >
            Back
          </ConnectButton>
          <ConnectButton
            textSize={19}
            rounded={16}
            theme="primary"
            style={{
              height: isMobile ? "54px" : "62px",
              width: isMobile ? "" : "160px",
              flex: 1,
            }}
            onClick={cta.callback}
            loading={cta.isLoading}
          >
            {!account
              ? "Connect Wallet"
              : chain.walletChainId !== form.value.network
              ? "Switch Chain"
              : "Create"}
          </ConnectButton>
        </Flex.CenterVertical>
      </div>
    </List>
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
  ${inDesktop(`
    height: 62px;
    font-size: 16px;
  `)}
  ${pressableStyle.opacity()}
`;

const ImagePreview = styled.img`
  width: 100%;
  margin-top: 12px;
  object-fit: contain;
  object-position: center;
`;