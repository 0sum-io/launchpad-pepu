import { inDesktop, Spacing, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { PageContainer } from "components/PageContainer";
import { useSortedPresaleList } from "../../hooks/useSortedPresaleList";
import { OrderSection, SaleCard, TitleSection } from "./components";
import { useMemo, useState } from "react";

export default function HomePage() {
  const isMobile = useCheckIsMobile();
  const sortedPresales = useSortedPresaleList();
  const [keyword, setKeyword] = useState("");
  const list = useMemo(
    () =>
      keyword
        ? sortedPresales.filter(
            (i) =>
              i.name?.toLowerCase().includes(keyword.toLowerCase()) ||
              i.symbol?.toLowerCase().includes(keyword.toLowerCase()) ||
              i.data.description?.toLowerCase().includes(keyword.toLowerCase())
          )
        : sortedPresales,
    [keyword, sortedPresales]
  );

  return (
    <div>
      {!isMobile && (
        <div>
          {/* <StyledBackground src="/images/img_swap_bg.png" />
          <CloudImage1 src="/images/img_cloud.png" />
          <CloudImage2 src="/images/img_cloud.png" />
          <StarImage src="/images/img_star_2.svg" /> */}
        </div>
      )}
      <PageContainer>
        <ContentContainer>
          <Spacing height={isMobile ? 56 : 104} />
          <TitleSection />
          <Spacing height={isMobile ? 48 : 64} />
          <OrderSection keyword={keyword} onKeywordChange={setKeyword} />
          <Spacing height={48} />
          <GridListContainer>
            {list?.map((presale) => (
              <a href={`/${presale.token}`} key={presale.token}>
                <SaleCard key={presale.id} data={presale} />
              </a>
            ))}
          </GridListContainer>
          <Spacing height={isMobile ? 64 : 168} />
        </ContentContainer>
      </PageContainer>
    </div>
  );
}

const ContentContainer = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  z-index: 1;
`;

const GridListContainer = styled.div`
  display: grid;
  grid-gap: 16px;
  ${inDesktop(`
    grid-gap: 24px 32px;
    grid-template-columns: 1fr 1fr 1fr;
  `)}
`;

const StyledBackground = styled.img`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 0;
  width: 1920px;
`;

const CloudImage1 = styled.img`
  position: absolute;
  top: 134px;
  left: calc(50% - 110px);
  width: 157px;
  z-index: 0;
`;

const CloudImage2 = styled.img`
  position: absolute;
  top: 260px;
  left: calc(50% - 735px);
  width: 137px;
  z-index: 0;
`;

const StarImage = styled.img`
  position: absolute;
  top: 160px;
  left: calc(50% - 665px);
  width: 45px;
  z-index: 0;
`;
