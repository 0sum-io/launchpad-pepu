import { adaptiveColors } from "@boxfoxs/bds-common";
import { withProps } from "@boxfoxs/react";
import styled from "@emotion/styled";
import { Dropdown } from "components/layout";

export const HeaderDropdown = styled(
  withProps(Dropdown, { position: "right" })
)`
  background: ${adaptiveColors.gray50};
`;
