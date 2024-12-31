import { Flex, Spacing, inDesktop, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { Logo } from "components/Logo";
import React, { useState } from "react";
import Link from "next/link";

export function Header() {
  const isMobile = useCheckIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeaderContainer
      backgroundColor={isMenuOpen && isMobile ? "#0F0F0F" : "transparent"}
    >
      <Flex.CenterVertical>
        <Logo />
        <Spacing width={40} />
      </Flex.CenterVertical>
      <NavListContainer>
        <Link href="/">
          <NavItem>Home</NavItem>
        </Link>
        {process.env.NEXT_PUBLIC_DEX_URL && (
          <a
            href={process.env.NEXT_PUBLIC_DEX_URL}
            target="_blank"
            rel="noreferrer"
          >
            <NavItem>Swap</NavItem>
          </a>
        )}
      </NavListContainer>
    </HeaderContainer>
  );
}

const HeaderContainer = styled(Flex.CenterVertical)<{
  backgroundColor: string;
}>`
  margin-top: 10px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  width: 100%;
  padding: 0px 16px;
  position: relative;
  z-index: 1;
  min-height: 56px;
  ${inDesktop(`
    padding: 0px 32px;
  `)}
`;

const NavListContainer = styled(Flex.CenterVertical)``;

const NavItem = styled.button<{ active?: boolean }>`
  margin: 5px;
  padding: 8px 18px;
  border-radius: 14px;
  background-color: rgb(48, 104, 185);
  color: white;
  border: 4px solid black;
  font-size: 16px;
  :hover {
    padding: 10px 20px;
    transition: all 250ms ease;
  }
`;
