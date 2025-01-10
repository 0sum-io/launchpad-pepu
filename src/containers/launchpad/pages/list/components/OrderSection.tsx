import { Flex, inDesktop } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ComponentProps, useRef } from "react";
import { useOrder, useSort } from "../../../hooks/usePresaleList";
import { SelectButton } from "./SelectButton";
import { Input } from "components/input";

const SORT_OPTIONS = [
  { value: "CREATE_ORDER", label: "Recently Listed" },
  // { value: "FEATURED", label: "Featured" },
  // { value: "CREATION_TIME", label: "Creation Time" },
  // { value: "LAST_REPLY", label: "Last Reply" },
  { value: "MARKET_CAP", label: "Market Cap" },
];

const ORDER_OPTIONS = [
  { value: "desc", label: "desc" },
  { value: "asc", label: "asc" },
];

export function OrderSection({
  keyword,
  onKeywordChange,
}: {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
}) {
  const [sort, setSort] = useSort();
  const [order, setOrder] = useOrder();

  return (
    <Container>
      {/* <SorterContainer>
        <SelectButton value={sort} onChange={setSort} options={SORT_OPTIONS} />
        <SelectButton
          value={order}
          onChange={setOrder}
          options={ORDER_OPTIONS}
        />
      </SorterContainer> */}
      <Input.Search
        placeholder="Search tokens"
        value={keyword}
        onChange={(e) => onKeywordChange(e.currentTarget.value)}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 30%;
  ${inDesktop(`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `)}
`;

const SorterContainer = styled(Flex.CenterVertical)`
  & > * {
    flex: 1;
  }
  & > * > button {
    width: 100%;
  }
  width: 100%;
  gap: 14px;

  ${inDesktop(`
    & > * {
      flex: none;
    }
    & > * > button {
      width: auto;
    }
  `)}
`;
