import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useSortedPresaleList } from "containers/launchpad/hooks";
import { inDesktop } from "@boxfoxs/bds-web";

const NewListingsTicker = () => {
  let [listings, setData] = useState([]);
  const sortedPresales = useSortedPresaleList();

  useEffect(() => {
    if (!sortedPresales) return;
    
    // Function to update the data
    const updateData = async () => {
      const newListings = await fetchData();
      let newDataSet = [];

      for (let listing of newListings) {
        const singleListing = {};
        // Find the sortedPresales token that matches the swap token
        const presale = sortedPresales.find((presale) => {
          if (listing.token0.id === presale.token) {
            return listing;
          }
          if (listing.token1.id === presale.token) {
            return listing;
          }
        });

        if (presale?.data?.iconUrl && presale?.name) {
          singleListing['avatar'] = presale?.data?.iconUrl || process.env.NEXT_PUBLIC_LOGO; // Replace with actual image URL
          singleListing['name'] = presale?.name;
          newDataSet.push(singleListing);
        }
      }

      // Leave only 20 records in newDataSet
      if (newDataSet.length >= 20) {
        newDataSet.length = 20;
      }

      // console.log("New dataset purchases:", newDataSet); // Debugging log
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
        query LastMints {
          mints(orderBy: timestamp, orderDirection: desc, limit: 25) {
            token0 {
              name
              id
              volume
              symbol
            }
            token1 {
              name
              id
              volume
              symbol
            }
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

    // json is swap data only
    // console.log("Latest Listings inside fetchData() ---> ", json);
    return json.data.mints;
  };

  return (
    <TickerContainer>
      <Label> New Listings </Label>
      <TickerWrapper>
        {listings.map((purchase, index) => (
          <TickerItem key={index}>
            <Avatar src={purchase.avatar} alt={purchase.name} />
            <span>
              {purchase.name} has just been listed |
            </span>
          </TickerItem>
        ))}
      </TickerWrapper>
    </TickerContainer>
  );
};

export default NewListingsTicker;

const TickerContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #2eb335;
  color: #fff;
  padding: 12px 30px;
  overflow: hidden;
  position: sticky;
  bottom: 0;
  z-index: 100;
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
  mask-image: linear-gradient(to left, transparent, black 45%, black 90%, transparent);

  ${inDesktop(`
    font-size: 22px;
    padding-left: 50px;
    mask-image: linear-gradient(to left, transparent, black 10%, black 90%, transparent);
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