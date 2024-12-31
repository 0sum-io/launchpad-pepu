import { Spacing, inDesktop } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { List } from "components/layout";
import { ComponentProps, ReactNode, memo } from "react";
import { hoverableStyle } from "utils/style";

export namespace Table {
  export interface HeaderItem {
    label: ReactNode;
    size?: number;
  }

  export interface BodyRowItem {
    id: string;
    onClick?: () => void;
    data: BodyItem[];
  }

  export interface BodyItem {
    id?: string;
    content: ReactNode;
    size?: number;
  }

  export function View({
    header,
    body,
  }: {
    header: HeaderItem[];
    body: BodyItem[][] | BodyRowItem[];
  }) {
    return (
      <ViewContainer>
        <Table.Header data={header} />
        <Table.Body data={body} />
      </ViewContainer>
    );
  }

  const ViewContainer = styled.div`
    position: relative;
  `;

  export const Header = memo(function Header({ data }: { data: HeaderItem[] }) {
    return (
      <HeaderRowContainer cellCount={data.length}>
        {data.map((item, idx) => (
          <HeadCell key={idx} size={item.size ?? 1}>
            {item.label}
          </HeadCell>
        ))}
      </HeaderRowContainer>
    );
  });

  export const HeaderRowContainer = styled.div<{ cellCount: number }>`
    display: flex;
    min-width: 0;
    ${inDesktop(`
            min-width: 0px;
        `)};
  `;

  export function Body({ data }: { data: BodyItem[][] | BodyRowItem[] }) {
    return data.length ? (
      <List divider={<Spacing height={8} />}>
        {data.map((row) => {
          const id = Array.isArray(row) ? row[0].id : row.id;
          const handleClick = Array.isArray(row) ? undefined : row.onClick;
          const items = Array.isArray(row) ? row : row.data;
          return (
            <BodyRowContainer
              key={`${id}`}
              onClick={handleClick}
              pressable={!!handleClick}
              cellCount={data.length}
            >
              {items.map((item, index) => (
                <BodyCell key={index} id={item.id} size={item.size ?? 1}>
                  {item.content}
                </BodyCell>
              ))}
            </BodyRowContainer>
          );
        })}
      </List>
    ) : (
      <Spacing height={56} />
    );
  }

  export const BodyRowContainer = styled.div<{
    pressable?: boolean;
    cellCount: number;
  }>`
    display: flex;
    ${(p) => (p.pressable ? hoverableStyle.background("#45454C50") : "")}
    ${(p) => (p.pressable ? "cursor: pointer;" : "")}
        min-width: calc(${({ cellCount }) => cellCount} * 120px);
    background: #f8f9fa;
    height: 90px;
    ${inDesktop(`
      min-width: 0px;
    `)}
  `;

  export const BodyRow = styled.div``;

  function HeadCell(props: ComponentProps<typeof StyledHeadCell>) {
    // const isMobile = useCheckIsMobile();
    return <StyledHeadCell {...props}>{props.children}</StyledHeadCell>;
  }

  const Cell = styled.div<{ size: number }>`
    display: block;
    flex: ${(p) => p.size};
  `;

  const StyledHeadCell = styled(Cell)`
    color: #7e7e85;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 12px; /* 100% */

    padding-bottom: 12px;
    line-height: 16px;
    ${inDesktop(`
            padding-bottom: 17px;
        `)}
  `;

  export function BodyCell(props: ComponentProps<typeof StyledBodyCell>) {
    return <StyledBodyCell {...props}>{props.children}</StyledBodyCell>;
  }

  const StyledBodyCell = styled(Cell)`
    padding: 10px 0;
    display: flex;
    align-items: center;
  `;
}
