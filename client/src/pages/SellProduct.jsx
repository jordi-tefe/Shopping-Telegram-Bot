import React from "react";
import { useLocation } from "react-router-dom";
import PostAd from "../Components/PostAdForm";
import Header from "../Components/Header";

const CheckoutPage = () => {

  const location = useLocation();
  const username = location.state?.username || "Guest User"; // Fallback if no username is provided
  const phoneNo = location.state?.phoneNo || "Guest Phone no"; // Fallback if no username is provided

  return (
    <>
    <p>Posting as: {username}</p>
    <Header/>
    
    <PostAd username={username} phoneNo={phoneNo} />

    </>
  );
}

export default CheckoutPage;
