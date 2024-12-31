import { inDesktop } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { useState } from "react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";

export function PresaleForm() {
  const [step, setStep] = useState(1);

  return (
    <FormContainer>
      {step === 1 && (
        <Step1
          nextStep={() => {
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <Step2
          prevStep={() => {
            setStep(1);
          }}
          nextStep={() => {
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <Step3
          prevStep={() => {
            setStep(2);
          }}
        />
      )}
    </FormContainer>
  );
}

const FormContainer = styled.div`
  padding: 32px 24px;

  border-radius: 18px;
  border: 4px solid black;
  background-color: rgb(48, 104, 185);
  box-shadow: rgb(0, 0, 0) 4px 4px;
`;
