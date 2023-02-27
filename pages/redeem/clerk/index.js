import React, { useState, useEffect, useRef } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import DetailsCard from "../../../components/redeem/detailsCard";
import Modal from "react-modal";
import Submit from "../../../components/modals/submitRedeem";
import Cancel from "../../../components/modals/cancel";
import PawnDetails from "../../../components/modals/pawnDetails";
import CheckItem from "../../../components/redeem/checkItemBox";
import DeleteItem from "../../../components/redeem/deleteItem";
import ItemMockData from "./ITEMS_MOCK_DATA";
import ItemCard from "../../../components/itemcard";


function RedeemClerk() {
  // Modals
  const [submitModal, setSubmitOpen] = useState(false); //Submit
  const [cancelModal, setCancelOpen] = useState(false); //Cancel
  const [customerModal, setCustomerOpen] = useState(false); //View Customer Details
  const [historyModal, setHistoryOpen] = useState(false); //Pawn History
  const [computationModal, setCompOpen] = useState(false); //View Computations
  const [PTNumber, setPTNumber] = useState("A-123456");
  const [checkedBoxes, setCheck] = useState();
  const redeem = [];
  let data = JSON.stringify(ItemMockData);
  let mockData = JSON.parse(data);
  let itemList = [];
  itemList = JSON.parse(data);

  // useEffect(() => {
  // 	countCheck();
  //   });

  function submitForm() {
    setSubmitOpen(true);
  }
  function countCheck() {
    setCheck(document.querySelectorAll('input[type="checkbox"]:checked'));
  }
  function cancelForm() {
    setCancelOpen(true);
  }

  function cancelContentShow() {
    return (
      <>
        Are you sure you want to cancel <b> Redemption</b> of <br />
        <b>{PTNumber}</b>? <br /> <br />
        All unsubmitted data will be lost.
      </>
    );
  }

  return (
    <>
      <NavBar></NavBar>
      <Header currentUser={"Kawachi, Hideki"}></Header>
      {/* First Half */}

      <Modal isOpen={submitModal} ariaHideApp={false} className="modal">
        <Submit trigger={submitModal} setTrigger={setSubmitOpen} />
      </Modal>

      <Modal isOpen={cancelModal} ariaHideApp={false} className="modal">
        <Cancel
          trigger={cancelModal}
          setTrigger={setCancelOpen}
          content={cancelContentShow()}
        />
      </Modal>

      <div id="main-content-area" className="flex-col">
        <p className="mb-5 text-xl font-semibold text-green-500 underline font-dosis">
          Redeem
        </p>
        <p className="mb-5 text-xl font-bold text-green-500 underline font-dosis">
          <a href="/redeem/manager">Temporary button to Manager Redeem</a>
        </p>
        <div className="flex">
          <DetailsCard></DetailsCard>
        </div>

        {/* Second Half */}

        <div className="flex">
          {/* Remaining Items  */}

          <div className="mt-20">
            <p className="ml-10 text-base font-bold font-nunito">
              Remaining Items:{" "}
            </p>
            {/* plan: CheckItem is ItemCard w/ Check*/}
            <div className="p-5 mx-10 w-[720px] h-96  overflow-y-scroll bg-white border-2">
              {/* plan: CheckItem & ItemCard section will be generated using .map */}
              {itemList.map((items, index) => (
                <CheckItem
                  key={index}
                  itemName={items.Name}
                  itemType={items.Type}
                  itemPrice={items.Price}
                ></CheckItem>
              ))}
            </div>
            <div className="mx-10 bg-gray-200 rounded-b-xl">
              <div className="py-3">
                <section className="ml-80">
                  <span className="ml-20 mr-10 font-bold font-nunito">
                    Selected ({checkedBoxes}){" "}
                  </span>
                  <button className="text-white bg-green-300">
                    Add to Redeem
                  </button>
                </section>
              </div>
            </div>
          </div>

          {/*Items for Redemption */}
          <div className="mt-20 ">
            <p className="ml-10 text-base font-bold font-nunito">
              Items for Redemption:{" "}
            </p>
            <div className="bg-white p-5 mx-10 w-[720px] h-[450px] overflow-y-scroll border-2">
              {redeem.length == 0 ? (
                <div className=" mt-44">
                  <p className="font-nunito text-gray-300 font-bold text-center text-xl">
                    {" "}
                    No items selected.
                  </p>
                  <p className="font-nunito text-gray-300 text-center text-sm">
                    {" "}
                    Select the items and click <i>Add to Redeem</i> to add the
                    items for redemption.
                  </p>
                </div>
              ) : (
                <DeleteItem></DeleteItem>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-row ml-[1180px]">
          <div>
            <button
              className="px-10 mx-2 my-5 text-base text-white bg-red-300"
              onClick={cancelForm}
            >
              Cancel
            </button>
          </div>
          <div>
            <button
              className="px-10 mx-2 my-5 text-base text-white bg-green-300"
              onClick={submitForm}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RedeemClerk;
