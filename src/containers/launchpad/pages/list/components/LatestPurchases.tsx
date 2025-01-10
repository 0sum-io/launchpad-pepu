import React from "react";
import styled from "@emotion/styled";

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

const LatestPurchasesTicker = () => {
  const purchases = [
    {
      avatar: process.env.NEXT_PUBLIC_LOGO, // Replace with actual image URL
      amount: "46374 WPEPU",
      name: "Grinchy",
    },
    {
      avatar: process.env.NEXT_PUBLIC_LOGO, // Replace with actual image URL
      amount: "938433 WPEPU",
      name: "MiniCat",
    },
    {
      avatar: process.env.NEXT_PUBLIC_LOGO, // Replace with actual image URL
      amount: "3837 WPEPU",
      name: "Grinchy",
    },
    {
      avatar: process.env.NEXT_PUBLIC_LOGO, // Replace with actual image URL
      amount: "2947333 WPEPU",
      name: "Grinchy",
    },
  ];

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
