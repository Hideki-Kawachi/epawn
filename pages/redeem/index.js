import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";
import DetailsCard from "../../components/redeem/detailscard";
import ItemCard from "../../components/itemcard";
import CheckItem from "../../components/redeem/checkItemBox";
import DeleteItem from "../../components/redeem/deleteItem";
function Redeem() {
	return (
    <>
      <NavBar></NavBar>
      <Header currentUser={"Kawachi, Hideki"}></Header>
      {/* First Half */}

      <div id="main-content-area" className="flex-col bg-gray-150">
        <p className="font-dosis text-green-500 text-xl font-semibold underline mb-5">
          Redeem
        </p>
        <div className="flex">
          <DetailsCard></DetailsCard>
        </div>

        {/* Second Half */}

        <div className="flex">
          {/* Remaining Items  */}

          <div className="mt-20">
            <p className="font-nunito font-bold text-base ml-10">
              Remaining Items:{" "}
            </p>
            {/* plan: CheckItem is ItemCard w/ Check*/}
            <div className="bg-white p-5 mx-10 h-96 overflow-y-scroll border-2">
              {/* plan: CheckItem & ItemCard section will be generated using .map */}
              <CheckItem></CheckItem>
              <CheckItem></CheckItem>
              <CheckItem></CheckItem>
              <CheckItem></CheckItem>
            </div>
            <div className="bg-gray-200 mx-10 rounded-b-xl">
              <div className="py-3">
                <section className="ml-80">
                  <span className="ml-20 mr-10 font-bold font-nunito">
                    Selected (0){" "}
                  </span>
                  <button className="bg-green-300 text-white">
                    Add to Redeem
                  </button>
                </section>
              </div>
            </div>
          </div>

          {/*Items for Redemption */}
          <div className="mt-20 ">
            <p className="font-nunito font-bold  text-base ml-10">
              Items for Redemption:{" "}
            </p>
            <div className="bg-white p-5 mx-10 max-h-[450px] overflow-y-scroll border-2">
              <DeleteItem></DeleteItem>
              <DeleteItem></DeleteItem>
              <DeleteItem></DeleteItem>
              <DeleteItem></DeleteItem>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Redeem;
