import { Flex, inDesktop, Spacing, useCheckIsMobile } from "@boxfoxs/bds-web";
import { commaizeNumber } from "@boxfoxs/utils";
import styled from "@emotion/styled";
import { ConnectButton } from "components/Button";
import { List } from "components/layout";
import { formatDecimals } from "utils/format";
import { useCreatePresaleState } from "../hooks/useCreateStore";
import {
  ChainInput,
  Label,
  Step,
  SubLabel,
  SubTitle,
  Title,
} from "./Components";
import { TooltipButton } from "../../../../../components/TooltipButton";
import { getClearedSymbol } from "utils/checkIsNative";
import React from "react";

interface Props {
  prevStep: () => void;
  nextStep: () => void;
}

export function Step2({ prevStep, nextStep }: Props) {
  const isMobile = useCheckIsMobile();
  const form = useCreatePresaleState();
  // const mc = useCalculateMarketCap(form.value);
  const handleNext = () => {
    const error = {
      amountToRaise: Number(form.value.amountToRaise)
        ? false
        : "Please enter a name",
      totalSupply: form.value.totalSupply ? false : "Please enter a symbol",
      minterAllocation: form.value.minterAllocation <= form.value.totalSupply * 0.2 ? false : "Max Allocation 20%",
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
          <Step>STEP 2</Step>
          <Spacing width={isMobile ? 10 : 12} />
          <SubTitle>Choose curve type</SubTitle>
        </Flex.CenterVertical>
      </div>
      <div>
        <Flex.CenterVertical justify="space-between">
          <Flex.CenterVertical>
            <Label>Amount to raise</Label>
            <Spacing width={10} />
            <SubLabel>
              {getClearedSymbol(form.value.paymentToken.symbol)}
            </SubLabel>
          </Flex.CenterVertical>
        </Flex.CenterVertical>
        <Spacing height={12} />
        <ChainInput
          type="tel"
          placeholder=""
          value={form.value.amountToRaise || ""}
          onChange={(e) => {
            const value = e.currentTarget.value.replace(/[^0-9.]/g, "");

            form.update({
              amountToRaise: Number(value)
                ? Math.max(Number(value) || 0, 0)
                : value,
            });
          }}
          error={form.error.amountToRaise}
        />
      </div>
      <div>
        <Flex.CenterVertical>
          <Label>Total Supply</Label>
          <Spacing width={10} />
          <SubLabel>min: 10M</SubLabel>
          <Spacing width={10} />
          <SubLabel>max: 10B</SubLabel>
        </Flex.CenterVertical>
        <Spacing height={12} />
        <ChainInput
          type="number"
          placeholder=""
          value={form.value.totalSupply || ""}
          onChange={(e) =>
            form.update({
              minterAllocation: 0,
              totalSupply: Math.max(
                Math.min(Number(e.currentTarget.value) || 0, 10000000000),
                10000000
              ),
            })
          }
          error={form.error.totalSupply}
        />
      </div>
      <div>
        <Flex.CenterVertical>
          <Label>Minter Allocation</Label>
          <Spacing width={10} />
          <SubLabel>
            max:{" "}
            {form.value.totalSupply
              ? commaizeNumber(formatDecimals(form.value.totalSupply * 0.2, 1))
              : "-"}{" "}
            (20%)
          </SubLabel>
          <Spacing width={10} />
          <TooltipButton
            position={isMobile ? "left" : "right"}
            content={
              <React.Fragment>
                Minter allocation is the token share given to <br /> project
                creators after a launchpad sale ends
              </React.Fragment>
            }
          />
        </Flex.CenterVertical>
        <Spacing height={12} />
        <ChainInput
          placeholder=""
          value={form.value.minterAllocation}
          onChange={(e) =>
            form.update({
              minterAllocation: Math.max(Number(e.currentTarget.value) || 0, 0),
            })
          }
          error={form.error.minterAllocation}
        />
      </div>
      {/* <Flex.CenterVertical
        direction={isMobile ? "column" : "row"}
        align="stretch"
        style={{ gap: isMobile ? "16px" : "24px" }}
      >
        {CURVES.map((item) => (
          <CurveButton
            active={form.value.curve === item.curve}
            onClick={() =>
              item.disabled
                ? alert("Coming Soon")
                : form.update({ curve: item.curve })
            }
          >
            <CurveType>{item.name}</CurveType>
            {(!isMobile || form.value.curve === item.curve) && (
              <div>
                <Spacing height={24} />
                <img
                  src={
                    form.value.curve === item.curve ? item.activeImg : item.img
                  }
                  alt="linear-chart"
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </CurveButton>
        ))}
      </Flex.CenterVertical> */}
      {/* <SummaryContainer>
        <Flex.CenterVertical
          direction={isMobile ? "column" : "row"}
          align="stretch"
        >
          <Flex.CenterVertical justify="space-between" style={{ flex: 1 }}>
            <Text
              style={{ fontSize: isMobile ? "12px" : "15px" }}
              color="#AAAAB6"
            >
              Total Liquidity
            </Text>
            <Text
              style={{ fontSize: isMobile ? "14px" : "15px", fontWeight: 500 }}
              color="#fff"
            >
              {commaizeNumber(
                form.value.totalSupply - form.value.minterAllocation
              )}{" "}
              {form.value.symbol}
            </Text>
          </Flex.CenterVertical>
          {!isMobile ? (
            <Text
              style={{ margin: "0 32px", fontSize: "24px" }}
              color="#383838"
            >
              +
            </Text>
          ) : (
            <Spacing height={8} />
          )}
          <Flex.CenterVertical justify="space-between" style={{ flex: 1 }}>
            <Text
              style={{ fontSize: isMobile ? "12px" : "15px" }}
              color="#AAAAB6"
            >
              Amount to Raise
            </Text>
            <Text
              style={{ fontSize: isMobile ? "14px" : "15px", fontWeight: 500 }}
              color="#fff"
            >
              {commaizeNumber(form.value.amountToRaise)}{" "}
              {getClearedSymbol(form.value.paymentToken.symbol)}
            </Text>
          </Flex.CenterVertical>
        </Flex.CenterVertical>
        <Divider marginVertical={16} color="#393838" width={"100%"} />
        <Flex.CenterVertical
          justify="space-between"
          align={isMobile ? "start" : "center"}
        >
          <Text
            style={{ fontSize: isMobile ? "12px" : "15px" }}
            color="#AAAAB6"
          >
            Expected Market Cap
          </Text>
          <div>
            <Text
              style={{ fontSize: isMobile ? "14px" : "17px", fontWeight: 500 }}
              color="#ff6f25"
            >
              {formatDecimal(mc.data || 0, 3)}{" "}
              {getClearedSymbol(form.value.paymentToken.symbol)}
            </Text>
            <Spacing height={4} />
            <Text
              style={{ textAlign: "right" }}
              size={isMobile ? "xxs" : "xs"}
              color="#AAAAB6"
            >
              $ 111,111
            </Text>
          </div>
        </Flex.CenterVertical>
      </SummaryContainer> */}
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
          onClick={handleNext}
          textSize={19}
          rounded={16}
          theme="primary"
          style={{
            height: isMobile ? "54px" : "62px",
            width: isMobile ? "" : "160px",
            flex: 1,
          }}
        >
          Next
        </ConnectButton>
      </Flex.CenterVertical>
    </List>
  );
}

const CurveButton = styled.button<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding: 14px 16px;
  border-radius: 12px;
  border-radius: 12px;
  border: ${(p) => (p.active ? "1px solid #ff844b" : "1px solid #454545")};
  background: ${(p) =>
    p.active
      ? "linear-gradient(0deg, rgba(255, 111, 37, 0.05) 0%, rgba(255, 111, 37, 0.05) 100%), #1B1B1B"
      : "#272727"};
  flex: 1;
  > div:first-child {
    background: ${(p) => (p.active ? "#ff844b" : "#383838")};
  }
  ${inDesktop(`
    padding: 20px 20px 24px 20px;
  `)}
`;

const CurveType = styled(Flex.Center)`
  width: fit-content;
  padding: 6px 14px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 100% */
  letter-spacing: -0.1px;
  ${inDesktop(`
    padding: 8px 14px;
    font-size: 16px;
  `)}
`;

const CURVES = [
  {
    curve: "linear",
    name: "Linear",
    activeImg: "/images/img_chart_linear_orange.svg",
    img: "/images/img_chart_linear_gray.svg",
    disabled: false,
  },
  {
    curve: "flat",
    name: "Flat",
    activeImg: "/images/img_chart_flat_orange.svg",
    img: "/images/img_chart_flat_gray.svg",
    disabled: true,
  },
] as const;
