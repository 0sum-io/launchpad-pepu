import { inDesktop, Spacing, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { PageContainer } from "components/PageContainer";
import { useSortedPresaleList } from "../../hooks/useSortedPresaleList";
import { OrderSection, TitleSection } from "./components";
import { useMemo, useRef, useState } from "react";
import dynamic from 'next/dynamic';

const FeaturedSection = dynamic(() => import('./components/FeaturedSection'), {
  loading: () => <p>Loading...</p>, // Optional fallback while loading
});

const SaleCard = dynamic(() => import('./components/SaleCard'), {
  loading: () => <p>Loading...</p>, // Optional fallback while loading
});

const MainPageStatistics = dynamic(() => import('./components/statistics/MainStatistics'), {
  loading: () => <p>Loading...</p>, // Optional fallback while loading
});

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

  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    const container = scrollRef.current;
  
    if (!container) return;
  
    const scrollAmount = 500; // Adjust based on how far to scroll
    const maxScrollLeft = container.scrollWidth - container.clientWidth; // Max scroll position
  
    if (direction === "right") {
      if (container.scrollLeft >= maxScrollLeft) {
        // If already at the end, reset to the start
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Scroll to the right
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    } else if (direction === "left") {
      if (container.scrollLeft === 0) {
        // If already at the start, move to the end
        container.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      } else {
        // Scroll to the left
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div>
      <PageContainer>
        <ContentContainer>

          <FeaturedSection />
          <Spacing height={isMobile ? 48 : 32} />

          <ContentSubContainer>
            <span> New Listings </span> 
            <OrderSection keyword={keyword} onKeywordChange={setKeyword} />
          </ContentSubContainer>
          <Spacing height={isMobile ? 48 : 32} />

          <GridListContainer ref={scrollRef}>
            {list?.map((presale) => (
              <a href={`/${presale.token}`} key={presale.token} style={{ whiteSpace: "normal" }}>
                <SaleCard key={presale.id} data={presale} />
              </a>
            ))}
          </GridListContainer>

          <ScrollButton onClick={() => handleScroll("left")} style={isMobile ? {left: "25%"} : {left: "50px"}}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "rotateY(180deg)" }}>
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ScrollButton>

          <ScrollButton onClick={() => handleScroll("right")} style={isMobile ? {right: "25%"} : {right: "50px"}}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ScrollButton>
          <Spacing height={isMobile ? 64 : 32} />

        </ContentContainer>
        <MainPageStatistics />
      </PageContainer>
    </div>
  );
}

const ContentContainer = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  z-index: 1;
  ${inDesktop(`
    z-index: 1;
    position: relative;
  `)}
`;

const ContentSubContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0px;
  z-index: 1;

  span {
    font-size: 24px;
    font-weight: bold;
    color: #FFF;
    text-transform: uppercase;
  }
`;

const GridListContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(2, min-content);
  grid-auto-flow: column;
  grid-auto-columns: minmax(300px, 1fr);
  grid-gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }

  ${inDesktop(`
    grid-gap: 16px;
    grid-template-rows: repeat(2, min-content);
    grid-auto-flow: column;
    grid-auto-columns: minmax(400px, 1fr);
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    padding: 0 5px;
    mask-image: linear-gradient(to right, transparent, black 2%, black 95%, transparent);
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

const ScrollButton = styled.button`
  position: absolute;
  top: 48%;
  transform: translateY(300%);
  width: 48px;
  height: 48px;
  background-color: #00b300; /* Green background */
  color: #fff; /* White arrow color */
  border: 2px solid #000;
  border-radius: 50%; /* Circle shape */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #009900; /* Darker green on hover */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Enhanced shadow on hover */
  }

  &:active {
    background-color: #006600; /* Even darker green on click */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Reduced shadow on click */
  }

  svg {
    width: 44px;
    height: 44px;
    color: #000;
  }

  ${inDesktop(`
    top: 50%;
  `)}
`;
