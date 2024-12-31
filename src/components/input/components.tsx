import { adaptiveColors, colors } from "@boxfoxs/bds-common";
import { Flex, inDesktop } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";

export const InputField = styled(Flex.CenterVertical)`
  padding: 12px 16px;
  min-height: 56px;
  height: 56px;
  border-radius: 8px;
  background: #272727;
  flex: 1;
  color: #e4e4e5;
  ${inDesktop(`
    height: 62px;
  `)};
`;

export const StyledInput = styled.input`
  flex: 1;
  background-color: transparent;
  font-size: 14px;
  line-height: 16px;
  min-width: 30px;
  color: #fff;
  ::placeholder {
    color: #62626d;
  }
  ${inDesktop(`
    font-size: 16px;
  `)}
`;

export const MaxButton = styled.button`
  padding: 7px 15px;
  border-radius: 24px;
  border: 1px solid #ff6f25;
  background: rgba(255, 111, 37, 0.1);
  color: #ff6f25;
  text-align: center;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  :hover {
    background: ${adaptiveColors.gray100};
    border: 1px solid ${colors.orange600};
  }
  ${inDesktop(`
    padding: 9px 15px;
  `)}
`;

export const SlippageButton = styled.button`
  padding: 5px 11px;
  border-radius: 24px;
  border: 1px solid #ff6f25;
  background: rgba(255, 111, 37, 0.1);
  color: #ff6f25;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  :hover {
    background: ${adaptiveColors.gray100};
    border: 1px solid ${colors.orange600};
  }
  ${inDesktop(`
    font-size: 13px;
    padding: 7px 13px;
  `)}
`;

export const Label = styled(Flex.CenterVertical)`
  position: relative;
  color: #8b8b8b;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 120% */
  ${inDesktop(`
    font-size: 15px;
  `)}
`;
