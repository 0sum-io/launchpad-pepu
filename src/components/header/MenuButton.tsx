import { Flex, Spacing } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { List } from "components/layout";
import { isLive } from "constants/env";
import Router from "next/router";
import { Dispatch, SetStateAction, useEffect } from "react";
import { pressableStyle } from "utils/style";

interface Props {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export function MenuControl({ isMenuOpen, setIsMenuOpen }: Props) {
  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setIsMenuOpen((prev) => !prev)}>
        {isMenuOpen ? (
          <XMarkIcon width={24} color="white" />
        ) : (
          <Bars3Icon width={24} color="white" />
        )}
      </button>
      {isMenuOpen && (
        <DropDownMenu>
          <Spacing height={70} />
          <List divider={<Spacing height={48} />}>
            {MENU_ITEMS.map((item, index) => (
              <MenuButton
                key={index}
                active={"/" + Router.pathname.split("/")[1] === item.path}
                onClick={() => {
                  if (item.path.startsWith("http")) {
                    window.open(item.path);
                  } else {
                    Router.push(item.path);
                  }
                  handleMenuClose();
                }}
              >
                {item.label}
              </MenuButton>
            ))}
          </List>
        </DropDownMenu>
      )}
    </div>
  );
}

const DropDownMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  right: -16px;
  top: 40px;
  width: 100vw;
  height: 100vh;
  background: #0f0f0f;
  z-index: 999;
`;

const ConnectedWallet = styled.button`
  display: flex;
  align-items: center;
  padding: 18px;
  width: 100%;
  ${pressableStyle.opacity()}
`;

const MenuButton = styled(Flex.Center)<{ active: boolean }>`
  color: ${({ active }) => (active ? "#FF844B" : "#FFF")};
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 30px; /* 125% */
  width: 100%;
  ${pressableStyle.background()}
`;

const MENU_ITEMS = [{ label: "Launchpad", path: "/launchpad" }];