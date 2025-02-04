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
import { hoverableStyle } from "utils/style";

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
      name: form.value.name && form.value.name.length < 100 ? false : "Please enter a name",
      symbol: form.value.symbol && form.value.name.length < 100 ? false : "Please enter a symbol",
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
      amountToRaise: 1_250_000, // Number(form.value.amountToRaise),
      totalSupply: 1_000_000_000, // form.value.totalSupply,
      amountToSale: 1_000_000_000, // form.value.totalSupply - form.value.minterAllocation,
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
      {/* <div style={{ position: "absolute", top: "30px", left: "80px" }}>
        <WalletControl left="0px" />
      </div> */}
      <List divider={<Spacing height={12} />}>
        <div style={{ display: "flex", justifyContent: "space-between"}}>
          <div style={{ width: "48%"}}>
            <Label>Name</Label>
            <Spacing height={12} />
            <ChainInput
              placeholder="Token name..."
              value={form.value.name}
              onChange={(e) => form.update({ name: e.currentTarget.value })}
              error={form.error.name}
            />
          </div>
          <div style={{ width: "48%"}}>
            <Label>Ticker</Label>
            <Spacing height={12} />
            <ChainInput
              placeholder="Search Tokens..."
              value={form.value.symbol}
              onChange={(e) => form.update({ symbol: e.currentTarget.value })}
              error={form.error.symbol}
            />
          </div>
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
        <div style={{ display: "flex", justifyContent: "space-between" , alignItems: "baseline" }}>
          <div style={{ width: "48%"}}>
            <ImageUpload>
              <div style={{ flex: 1 }}>
                <Label>IMAGE</Label>
                <Spacing height={12} />
                <UploadButton
                  onClick={() => selectImageFile().then(setIcon)}
                  error={form.error.icon}
                >
                  <img src="/images/ic_document.svg" alt="upload" width={20} />
                  <span>{icon ? icon.name : "drag and drop or click the button to upload an image"}</span>

                  <FakeStyledButton> Select File </FakeStyledButton>
                </UploadButton>
                {icon && <ImagePreview src={icon.data} alt="icon" />}
              </div>
            </ImageUpload>
          </div>
          <div style={{ width: "48%", height: "222px" }}>
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
            <Spacing height={12} />
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
            <Spacing height={12} />
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
          </div>
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
              width: "100%",
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  height: 222px;
  border-radius: 16px;
  background: #272727;
  color: #62626d;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  width: 100%;
  border: 2px solid #393939;
  color: rgba(255, 255, 255, 0.6);
  border: 2px solid ${(p) => (p.error ? colors.red500 : `border: 2px solid #393939`)};
  span {
    padding-top: 18px;
    font-size: 16px;
  }
`;

const ImagePreview = styled.img`
  width: 150px;
  margin-top: 12px;
  object-fit: contain;
  object-position: center;
`;

const ImageUpload = styled.div`
  height: auto;
`;

const FakeStyledButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  border-radius: 100%;
  font-weight: 700;
  font-size: 14px;
  padding: 16px 18px;
  width: auto;
  text-wrap: nowrap;
  background: #000;
  border: 2px solid #2eb335;
  color: #FFF;
  margin-top: 12px;
  ${hoverableStyle.scale(1.02)};

  border-radius: 32px;
`;