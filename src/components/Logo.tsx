import { Flex, Spacing, inDesktop, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import Link from "next/link";

export function Logo() {
  const isMobile = useCheckIsMobile();

  return (
    <Link href="/">
      <a>
        <img
          width={isMobile ? 24 : 28}
          height={isMobile ? 24 : 28}
          src={process.env.NEXT_PUBLIC_LOGO}
          alt="logo"
          style={{ transform: "rotateY(180deg)" }}
        />
      </a>
    </Link>
  );
}

const LogoContainer = styled(Flex.CenterVertical)`
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  color: #212529;
  color: #fff;
  ${inDesktop(`
      font-size: 20px;
  `)}
`;
