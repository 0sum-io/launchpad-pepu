import styled from "@emotion/styled";
import { Steps } from "./Steps";

export function PresaleForm() {
  return (
    <FormContainer>
      <Steps />
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
