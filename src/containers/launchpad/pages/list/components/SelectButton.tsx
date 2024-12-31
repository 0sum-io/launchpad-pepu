import { inDesktop, Spacing, useCheckIsMobile } from "@boxfoxs/bds-web";
import { useBooleanState } from "@boxfoxs/core-hooks";
import styled from "@emotion/styled";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import useOutsideClick from "hooks/dom/useOutsideClick";
import { useRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function SelectButton({ value, onChange, options }: Props) {
  const isMobile = useCheckIsMobile();
  const [isOpen, open, close, toggle] = useBooleanState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, close);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <StyledButton onClick={toggle} isOpen={isOpen}>
        {options.find((i) => i.value === value)?.label}
        <Spacing width={8} />
        <ChevronDownIcon
          width={isMobile ? 20 : 24}
          color="#9E9EA4"
          style={{ transform: isOpen ? "rotate(180deg)" : "" }}
        />
      </StyledButton>
      {isOpen && (
        <Dropdown>
          {options.map((option) => (
            <DropdownItem
              key={option.value}
              onClick={() => {
                onChange(option.value);
                close();
              }}
            >
              {option.label}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </div>
  );
}

const StyledButton = styled.button<{ isOpen?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  color: #fff;
  white-space: nowrap;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  ${inDesktop(`
    height: 52px;
    padding: 0 18px;
    font-size: 16px;
    min-width: 180px;
  `)}

  border-radius: 18px;
  border: 4px solid black;
  background-color: rgb(48, 104, 185);
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding-bottom: 8px;
  z-index: 999;

  border-radius: 18px;
  border: 4px solid black;
  background-color: rgb(48, 104, 185);
`;

const DropdownItem = styled.button`
  display: block;
  padding: 14px 18px;
  color: #fff;
  text-align: left;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  width: 100%;
`;
