import { Flex, Spacing, inDesktop, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { Logo } from "components/Logo";
import React, { useState } from "react";
import Link from "next/link";
import { MenuControl } from "./MenuButton";

export function Header() {
  const isMobile = useCheckIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeaderContainer
      backgroundcolor={isMenuOpen && isMobile ? "#0F0F0F" : "transparent"}
    >

      <Logo />
      <Link href="/">
        <Title> Pepe’s Pump Pad </Title>
      </Link>
      <Spacing width={40} />

      {isMobile && <MenuControl isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}

      {!isMobile && 
        <NavListContainer style={{ marginLeft: "auto" }}>
          <Link href="/">
            <NavItem>Home</NavItem>
          </Link>
          <Link href="/how-it-works">
            <NavItem>How It Works</NavItem>
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
      }

      {!isMobile && 
        <Flex.CenterVertical style={{ marginLeft: "0px" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              color: "#285fb0",
              marginLeft: "20px"
            }}
            onClick={() => window.open("https://x.com/pepe_unchained", "_blank")}
          >
            <img
              src="/images/twitter.svg"
              alt="Twitter"
              style={{ width: "48px", height: "48px" }}
            />
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              color: "#285fb0",
              marginLeft: "20px"
            }}
            onClick={() => window.open("https://t.me/pepeunchained", "_blank")}
          >
            <img
              src="/images/telegram.svg"
              alt="Telegram"
              style={{ width: "48px", height: "48px" }}
            />
          </button>
        </Flex.CenterVertical>
      }

    </HeaderContainer>
  );
}

const HeaderContainer = styled(Flex.CenterVertical)<{
  backgroundcolor: string;
}>`
  z-index: 1000;
  margin-top: 10px;
  background-color: ${({ backgroundcolor }) => backgroundcolor};
  width: 80%;
  padding: 0px 16px;
  position: relative;
  z-index: 1;
  min-height: 56px;
  margin-left: auto;
  margin-right: auto;
  ${inDesktop(`
    padding: 30px 150px 0;
  `)}
`;

const Title = styled.h1`
  padding-left: 10px;
  width: auto;
  position: relative;
  color: #2eb335;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
    ${inDesktop(`
    font-size: 27px;
  `)}
`;

const NavListContainer = styled(Flex.CenterVertical)``;

const NavItem = styled.button<{ active?: boolean }>`
  margin: 5px;
  padding: 8px 18px;
  border-radius: 14px;
  color: #2eb335;
  font-size: 20px;
  cursor: pointer;
  font-weight: 700;
`;