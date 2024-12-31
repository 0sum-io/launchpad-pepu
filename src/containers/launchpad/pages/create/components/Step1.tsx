import { Flex, Spacing, useCheckIsMobile } from "@boxfoxs/bds-web";
import { ConnectButton } from "components/Button";
import { List } from "components/layout";
import React from "react";
import { useCreatePresaleState } from "../hooks/useCreateStore";
import { ChainInput, Label, Step, SubTitle } from "./Components";

interface Props {
  nextStep: () => void;
}

export function Step1({ nextStep }: Props) {
  const isMobile = useCheckIsMobile();
  const form = useCreatePresaleState();
  const handleNext = () => {
    const error = {
      name: form.value.name ? false : "Please enter a name",
      symbol: form.value.symbol ? false : "Please enter a symbol",
    };
    form.setError(error);
    if (Object.values(error).every((i) => !i)) {
      nextStep();
    }
  };

  return (
    <List divider={<Spacing height={isMobile ? 32 : 40} />}>
      <div>
        <Flex.CenterVertical>
          <Step>STEP 1</Step>
          <Spacing width={isMobile ? 10 : 12} />
          <SubTitle>Set up basic information</SubTitle>
        </Flex.CenterVertical>
      </div>
      <div>
        <Label>Token name</Label>
        <Spacing height={12} />
        <ChainInput
          placeholder=""
          value={form.value.name}
          onChange={(e) => form.update({ name: e.currentTarget.value })}
          error={form.error.name}
        />
      </div>
      <div>
        <Label>Ticker</Label>
        <Spacing height={12} />
        <ChainInput
          placeholder=""
          value={form.value.symbol}
          onChange={(e) => form.update({ symbol: e.currentTarget.value })}
          error={form.error.symbol}
        />
      </div>
      <ConnectButton
        onClick={handleNext}
        textSize={19}
        rounded={16}
        theme="primary"
        style={{
          height: isMobile ? "56px" : "62px",
          width: isMobile ? "100%" : "160px",
          marginLeft: "auto",
        }}
      >
        Next
      </ConnectButton>
    </List>
  );
}
