import React, { useState, useEffect, useRef } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import DetailsCard from "../../../components/redeem/detailsManager";
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
		} else if (req.session.userData.role == "manager") {
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

function RedeemManager({ currentUser }) {
	// Modals
	const [submitModal, setSubmitOpen] = useState(false); //Submit
	const [cancelModal, setCancelOpen] = useState(false); //Cancel
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

			<div id="main-content-area" className="flex-col">
				<p className="mb-5 text-xl font-semibold text-green-500 underline font-dosis">
					Redeem
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
						<div className="bg-white p-5 mx-10 w-[720px] h-[450px] overflow-y-scroll border-2">
							{itemList.map((items, index) => (
								<ItemCard
									key={index}
									itemName={items.Name}
									itemType={items.Type}
									itemPrice={items.Price}
								></ItemCard>
							))}
						</div>
					</div>

					{/*Items for Redemption */}
					<div className="mt-20 ">
						<p className="ml-10 text-base font-bold font-nunito">
							Items for Redemption:{" "}
						</p>
						<div className="bg-white p-5 mx-10 w-[720px] h-[450px] overflow-y-scroll border-2">
							{itemList.map((items, index) => (
								<ItemCard
									key={index}
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

export default RedeemManager;
