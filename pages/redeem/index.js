import React, {useState} from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";
import DetailsCard from "../../components/redeem/detailscard";
import CheckItem from "../../components/redeem/checkItemBox";
import DeleteItem from "../../components/redeem/deleteItem";
import Modal from "react-modal";
import Submit from "../../components/modals/submitRedeem";
import Cancel from "../../components/modals/cancel";
import PawnDetails from "../../components/modals/pawnDetails";

function Redeem() {
  // Modals
  const [submitModal, setSubmitOpen] = useState(false); //Submit
  const [cancelModal, setCancelOpen] = useState(false); //Cancel
  const [customerModal, setCustomerOpen] = useState(false); //View Customer Details
  const [historyModal, setHistoryOpen] = useState(false); //Pawn History
 


  function submitForm() {
    setSubmitOpen(true);
  }

    function cancelForm() {
      setCancelOpen(true);
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
        <Cancel trigger={cancelModal} setTrigger={setCancelOpen} />
      </Modal>

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
        <div className="mt-5 flex flex-row ml-[1180px]">
          <div>
            <button
              className="bg-red-300 text-white text-base px-10 mx-2 my-5"
              onClick={cancelForm}
            >
              Cancel
            </button>
          </div>
          <div>
            <button
              className="bg-green-300 text-white text-base px-10 mx-2 my-5"
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

export default Redeem;
