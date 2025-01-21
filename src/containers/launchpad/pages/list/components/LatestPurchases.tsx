import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useSortedPresaleList } from "containers/launchpad/hooks";

const LatestPurchasesTicker = () => {
  let [purchases, setData] = useState([]);
  const sortedPresales = useSortedPresaleList();

  useEffect(() => {
    if (!sortedPresales || !purchases) return;
    
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

      // console.log("New dataset purchases:", newDataSet); // Debugging log
      setData(newDataSet);
    };

    // Set up the interval
    const interval = setInterval(updateData, 5000); // Every 5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);

  }, [sortedPresales]);

  // fetch data from graphql
  const fetchData = async () => {
    const query = `
        query LastSwap {
          swaps(orderBy: timestamp, orderDirection: desc) {
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

    // Get presale info
    /* for (let token of uniqueSwaps) {
      const presaleContract = getPresaleContract(token.token0.id, provider);
      console.log("Presale contract ---> ", presaleContract);
      
      const info = await presaleContract.tokenInfo();
      console.log("Presale info ---> ", info);
    } */

    // json is swap data only
    // console.log("Latest Purchases inside fetchData() ---> ", uniqueSwaps);
    return uniqueSwaps;
  };

  return (
    <TickerContainer>
        <p style={{ 
            display: "flex",
            alignItems: "center",
            fontSize: "22px", 
            fontWeight: "700", 
            minWidth: "270px", 
            height: "32px",
            paddingLeft: "50px", 
            background: "#2eb335", 
            zIndex: "1", 
            maskImage: "linear-gradient(to left, transparent, black 10%, black 90%, transparent)" }}> Latest Purchases </p>
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

const TickerWrapper = styled.div`
  display: flex;
  gap: 24px;
  white-space: nowrap;
  animation: scroll 45s linear infinite;

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