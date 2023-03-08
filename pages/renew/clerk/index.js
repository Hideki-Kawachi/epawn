import React, { useState, useEffect, useRef } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import DetailsCardClerk from "../../../components/renew/detailsClerk";
import Modal from "react-modal";
import Submit from "../../../components/modals/submitRedeem";
import Cancel from "../../../components/modals/cancel";
import PawnDetails from "../../../components/modals/pawnDetails";
import ItemMockData from "./ITEMS_MOCK_DATA";
import ItemCard from "../../../components/itemcard";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "clerk") {
			return {
				props: { currentUser: req.session.userData },
			};
		} else if (req.session.userData.role == "customer") {
			return {
				redirect: { destination: "/customer", permanent: true },
				props: {},
			};
		} else {
			return {
				redirect: { destination: "/" },
			};
		}
	},
	ironOptions
);

function RenewClerk({ currentUser }) {
	// Modals
	const [submitModal, setSubmitOpen] = useState(false); //Submit
	const [cancelModal, setCancelOpen] = useState(false); //Cancel
	const [customerModal, setCustomerOpen] = useState(false); //View Customer Details
	const [historyModal, setHistoryOpen] = useState(false); //Pawn History
	const [PTNumber, setPTNumber] = useState("A-123456");
	const [checkedBoxes, setCheck] = useState();
	const redeem = [];
	let data = JSON.stringify(ItemMockData);
	let mockData = JSON.parse(data);
	let itemList = [];
	itemList = JSON.parse(data);

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
      <NavBar currentUser={currentUser}></NavBar>
      <Header currentUser={currentUser}></Header>
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

      <div id="main-content-area" className="flex-col ">
        <p className="text-xl font-semibold text-green-500 underline font-dosis">
          Renew
        </p>
        <p className="mb-5 text-lg text-green-500 font-dosis">
          On-site Renewal
        </p>

        <div className="flex">
          <DetailsCardClerk></DetailsCardClerk>
        </div>

        {/* Second Half */}

        <div className="flex py-10 mt-20 bg-white shadow-lg rounded-xl">
          {/* Remaining Items  */}

          <div className="px-5">
            <p className="ml-10 text-base font-bold font-nunito">
              New Pawn Details:{" "}
            </p>

            <div className="flex my-10 ml-10 mr-32 text-base font-nunito ">
              <div className="ml-5 text-right">
                <p>
                  <b>
                    <i>New </i>
                  </b>
                  Date Loan Granted:
                </p>
                <p>
                  <b>
                    <i>New </i>
                  </b>
                  Maturity Date:
                </p>
                <p>
                  <b>
                    <i>New </i>
                  </b>
                  Expiry Date of Redemption:
                </p>
              </div>
              <div className="ml-8 text-left">
                <p>12/09/2022</p>
                <p>01/09/2022</p>
                <p>02/09/2022</p>
              </div>
            </div>
          </div>

          {/*Items*/}
          <div className="">
            <p className="ml-10 text-base font-bold font-nunito">Items: </p>
            <div className="bg-white px-5 mx-10 w-[720px] h-[280px] overflow-y-scroll border-2">
              {itemList.map((items, index) => (
                <ItemCard
                  key={index}
                  itemID={items.ItemID}
                  itemName={items.Name}
                  itemType={items.Type}
                  itemPrice={items.Price}
                ></ItemCard>
              ))}
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

export default RenewClerk;
