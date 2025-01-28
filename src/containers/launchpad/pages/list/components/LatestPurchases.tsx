import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useSortedPresaleList } from "containers/launchpad/hooks";
import { inDesktop } from "@boxfoxs/bds-web";

const LatestPurchasesTicker = () => {
  let [purchases, setData] = useState([]);
  const sortedPresales = useSortedPresaleList();

  useEffect(() => {
    if (!sortedPresales) return;
    
    // Function to update the data
    const updateData = async () => {
      const newSwaps = await fetchData();
      let newDataSet = [];

      for (let swap of newSwaps) {
        const singleSwap = {};
        // Find the sortedPresales token that matches the swap token
        const presale = sortedPresales.find((presale) => presale.token === swap.token0.id);
        
        singleSwap['avatar'] = presale?.data?.iconUrl || process.env.NEXT_PUBLIC_LOGO; // Replace with actual image URL
        singleSwap['amount'] = `${swap.amount0 < 0 ? swap.amount0 * -1 : swap.amount0}`;
        singleSwap['name'] = swap.token0.name;
        
        newDataSet.push(singleSwap);
      }

      setData(newDataSet);
    };

    updateData();
    // Set up the interval
    const interval = setInterval(updateData, 60000); // Every 60 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);

  }, [sortedPresales]);

  // fetch data from graphql
  const fetchData = async () => {
    const query = `
        query LastSwap {
          swaps(orderBy: timestamp, orderDirection: desc, limit: 25) {
            token0 {
              name
              id
              volume
              symbol
            }
            amount0
            amount1
          }
        }
    `;

    const json = await fetch(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());

    // Deduplicate swaps by token0 ID
    const uniqueSwaps = [];
    const seenTokenIds = new Set();

    json.data.swaps.forEach((swap) => {
      if (!seenTokenIds.has(swap.token0.id)) {
        uniqueSwaps.push(swap);
        seenTokenIds.add(swap.token0.id);
      }
    });

    return uniqueSwaps;
  };

  return (
    <TickerContainer>
        <Label> Latest Purchases </Label>
        <TickerWrapper>
            {purchases.map((purchase, index) => (
            <TickerItem key={index}>
                <Avatar src={purchase.avatar} alt={purchase.name} />
                <span>
                {purchase.amount} of {purchase.name} bought |
                </span>
            </TickerItem>
            ))}
        </TickerWrapper>
    </TickerContainer>
  );
};

export default LatestPurchasesTicker;

const TickerContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #2eb335;
  color: #fff;
  padding: 12px 30px;
  overflow: hidden;
  position: relative;
`;

const Label = styled.p`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  min-width: 210px;
  height: 32px;
  background: #2eb335;
  z-index: 1;
  padding-left: 20px;
  mask-image: linear-gradient(to left, transparent, black 15%, black 95%, transparent);

  ${inDesktop(`
    min-width: 250px;
    font-size: 22px;
    padding-left: 50px;
    mask-image: linear-gradient(to left, transparent, black 5%, black 90%, transparent);
  `)}
`;

const TickerWrapper = styled.div`
  display: flex;
  gap: 24px;
  white-space: nowrap;
  animation: scroll 60s linear infinite;

  /* Offset the animation */
  animation-delay: -15s;

  @keyframes scroll {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;

const TickerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 20px;
  color: #000;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;