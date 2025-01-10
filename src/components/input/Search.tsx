import { Flex, inDesktop } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ComponentProps, useRef } from "react";

export namespace Input {
  interface Props extends ComponentProps<"input"> {
    bordered?: boolean;
  }

  export function Search(props: Props) {
    const inputRef = useRef<HTMLInputElement>();
    return (
      <SearchInputField
        className="SearchTokens"
        onClick={() => inputRef.current.focus()}
        bordered={props.bordered}
      >
        <MagnifyingGlassIcon width={20} color="#fff" />
        <SearchInput ref={inputRef} {...props} />
      </SearchInputField>
    );
  }

  const SearchInputField = styled(Flex.CenterVertical)<{ bordered?: boolean }>`
    padding: 14px 18px;
    gap: 16px;
    width: 100%;
    height: 52px;
    border-radius: 25px;
    border: 2px solid #2f2f2f;
    background: #272727;
  `;

// change search input placeholder color
  const SearchInput = styled.input`
    font-family: Grandstander;
    flex: 1;
    background-color: transparent;
    color: #fff;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    min-width: 0;
    width: 0;
    ::placeholder {
      color: #fff;
    }
    ${inDesktop(`
      font-size: 16px;
    `)}
  `;
}
