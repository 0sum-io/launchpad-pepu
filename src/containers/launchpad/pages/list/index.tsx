import { inDesktop, Spacing, useCheckIsMobile } from "@boxfoxs/bds-web";
import styled from "@emotion/styled";
import { PageContainer } from "components/PageContainer";
import { useSortedPresaleList } from "../../hooks/useSortedPresaleList";
import { OrderSection, TitleSection } from "./components";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from 'next/dynamic';
import { hoverableStyle, pressableStyle } from "utils/style";
import Link from "next/link";
import { LoadingLottie } from "components/lotties/LoadingLottie";

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
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const sortedPresales = useSortedPresaleList();
  const [keyword, setKeyword] = useState("");
  let [loadingNewPage, setLoadingNewPage] = useState(false);

  const list = useMemo(
    () => {
      if (keyword) {
        return filteredList;
      } else {
        setLoadingNewPage(false);
        return sortedPresales;
      }
    },
    [keyword, filteredList, sortedPresales]
  );

  // Check if user already seen the dialog, use local storage to store the state
  useEffect(() => {
    const seen = localStorage.getItem("seen");
    if (!seen) {
      setDialogOpen(true);
    }
  }, []);

  // Fetch filtered presales by keyword
  useEffect(() => {
    if (keyword.length > 0) {
      setLoadingNewPage(true);
  
      const timeout = setTimeout(() => {
        fetchPresales(keyword);
      }, 3000);
  
      return () => clearTimeout(timeout); // Clear timeout on keyword change
    }
    }, [keyword]);

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

  // On search fetch presale data by string
  const fetchPresales = async (keyword) => {
    const query = `
      query GetTokensData {
        presales(where: { name_contains: "${keyword}" }, orderBy: blockNumber) {
          id
          data
          name
          pairAddress
          paymentToken
          presaleAmount
          saleAmount
          symbol
          token
          totalSupply
          transactionHash
          blockTimestamp
          blockNumber
          minter
        }
      }
    `;

    const tokensDataJson = await fetch(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());

    // Every token tokenDataJson.data.presales have data atribute that needs to be JSON.parse
    tokensDataJson.data.presales.forEach((presale) => {
      presale.data = JSON.parse(presale.data);
    });

    // Loading is completed
    setLoadingNewPage(false);

    setFilteredList(tokensDataJson.data.presales);
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

          {
            !loadingNewPage && (
              <>
                {
                  list.length > 0 && (
                    <>
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
                    </>
                  )
                }

                {
                  list.length == 0 && (
                    <p style={{ textAlign: "center", color: "#fff", fontSize: "18px" }}> No Tokens Found </p> 
                  )
                }
              </>
            )
          }

          {
            loadingNewPage && (
              <>
                <Spacing height={28} />
                <LoadingLottie width={36} />
                <Spacing height={28} />
              </>
            )
          }

          <Spacing height={isMobile ? 64 : 32} />

        </ContentContainer>
        <MainPageStatistics />
      </PageContainer>

      {isDialogOpen && (
        <DialogOverlay>
          <Dialog>
            <CloseButton onClick={() => {
              setDialogOpen(false);
              localStorage.setItem("seen", "true");
            }}>&times;</CloseButton>

            <Spacing height={18} />
            <h3 style={{ fontSize: "32px", fontWeight: "700", textAlign: "center" }}>NEW TO THE PAD?</h3>

            <Spacing height={18} />
            <Content>
              {" "}
              We strongly suggest reading the How To Section Before you get started.{" "}
            </Content>

            <Spacing height={18} />
            <Link href="/how-it-works">
              <ButtonContainer>Take Me to How It Works</ButtonContainer>
            </Link>

            <Spacing height={18} />
            <span style={{cursor: "pointer", textDecoration: "underline" }} onClick={() => {
              setDialogOpen(false);
              localStorage.setItem("seen", "true");
            }}>Proceed</span>
          </Dialog>
        </DialogOverlay>
      )}
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

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  background: #1e1e1e;
  color: #fff;
  padding: 20px;
  border-radius: 16px;
  border: 2px solid #3B3B3B;
  width: 90%;
  max-width: 565px;
  height: 300px;
  position: relative;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;

  &:hover {
    color: #aaa;
  }
`;

const Content = styled.div`
  font-family: Grandstander;
  line-height: 24px;
  font-weight: 500;
  font-size: 20px;
  color: #fff;
  height: auto;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  font-family: Grandstander;
  font-size: 20px;
  position: relative;
  width: 295px;
  text-align: center;
  border: 2px solid #000;
  padding: 20px;
  border-radius: 35px;
  margin-left: auto;
  margin-right: auto;
  background: #2eb335;
  height: max-content;
  color: #000;
  cursor: pointer;
  font-weight: 700;

  ${hoverableStyle.scale(1.02)}
  ${pressableStyle.scale()}

    ${inDesktop(`
        position: relative;
        font-size: 20px;
        width: 295px;
        text-align: center;
        border: 2px solid #000;
        padding: 20px;
        border-radius: 35px;
        margin-left: auto;
        margin-right: auto;
        height: max-content;
        font-weight: 700;
    `)}
`;
