import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";
import DetailsCard from "../../components/redeem/detailscard";

function Redeem() {
	return (
    <>
      <NavBar></NavBar>
      <Header currentUser={"Kawachi, Hideki"}></Header>
      <div id="main-content-area" className="flex-col">
        <p className="font-nunito text-green-500 text-xl font-bold">Redeem</p>
        <div className="flex">
          <DetailsCard></DetailsCard>  
        </div>
      </div>
    </>
  );
}

export default Redeem;
