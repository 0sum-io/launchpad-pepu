import { colors } from "@boxfoxs/bds-common";
import { inDesktop } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { ComponentProps } from "react";

export const Title = styled.div`
  color: #fff;
  font-size: 17px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.1px;
  ${inDesktop(`
    font-size: 20px;
    line-height: 24px; /* 120% */
  `)}
`;

export const Step = styled.div`
  color: ${process.env.NEXT_PUBLIC_COLOR};
  font-size: 17px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.1px;
  ${inDesktop(`
    font-size: 18px;
    font-weight: 700;
    line-height: 24px; /* 120% */
  `)}
`;

export const SubTitle = styled.div`
  color: #bdbdbd;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.1px;
  ${inDesktop(`
    font-size: 18px;
    line-height: 24px; /* 133.333% */
  `)}
`;

export const Label = styled.div`
  color: #e4e4e5;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 100% */
  text-transform: uppercase;
  ${inDesktop(`
    font-size: 16px;
  `)}
`;

export const SubLabel = styled.div`
  color: #9e9ea4;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 106.667% */
  ${inDesktop(`
    font-size: 15px;
  `)}
`;

export function ChainInput({
  error,
  ...props
}: ComponentProps<"input"> & { error?: boolean | string }) {
  return <StyledInput {...props} error={!!error} />;
}

export const StyledInput = styled.input<{ error?: boolean }>`
  height: 46px;
  padding: 0px 16px;
  width: 100%;
  border-radius: 63px;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  background: #272727;
  border: 2px solid #393939;
  color: #fff;
  ${(p) => (p.error ? `border: 2px solid ${colors.red500};` : `border: 2px solid #393939`)}
  ${inDesktop(`
    height: 46px;
    font-size: 16px;
  `)}

  ::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  :focus {
    caret-color: rgba(255, 255, 255, 0.6);
  }

  font-family: Grandstander;
`;

export const StyledTextArea = styled.textarea`
  height: 46px;
  padding: 20px 16px;
  width: 100%;
  border-radius: 63px;
  resize: none;
  border: none;
  outline: none;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 125% */
  background: #272727;
  border: 2px solid #393939;
  color: #fff;
    ${inDesktop(`
    height: 46px;
    padding: 12px 16px;
    font-size: 16px;
    line-height: 20px; /* 125% */
  `)}

  ::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  :focus {
    caret-color: rgba(255, 255, 255, 0.6);
  }

  font-family: Grandstander;
`;

export const Badge = styled.div<{ color?: string }>`
  display: flex;
  padding: 6px 12px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: #285FB0;
  border-radius: 8px;
  color: ${(p) => p.color || "#ff6f25"};
  ${(p) => (p.onClick ? `cursor: pointer;` : ``)}
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 114.286% */
  letter-spacing: -0.1px;
  ${inDesktop(`
    font-size: 15px;
  `)}
`;
