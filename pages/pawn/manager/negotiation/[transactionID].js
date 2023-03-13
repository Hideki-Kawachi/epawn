import React, { useEffect, useState } from "react";
import Header from "../../../../components/header";
import NavBar from "../../../../components/navigation/navBar";
import AppraisalTable from "../../../../components/pawn/appraisal/appraisalTable";
import Data from "../../../../components/tempData/appraisalTable.json";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../../utilities/config";
import { Router, useRouter } from "next/router";
import Transaction from "../../../../schemas/transaction";
import Item from "../../../../schemas/item";
import PriceHistory from "../../../../schemas/priceHistory";
import PriceHistoryModal from "../../../../components/modals/priceHistoryModal";
import dbConnect from "../../../../utilities/dbConnect";
import User from "../../../../schemas/user";
import AppraisalItemListCard from "../../../../components/pawn/appraisal/appraisalItemListCard";
import AppraisalItemsDetails from "../../../../components/pawn/appraisal/appraisalItemDetails";
import mongoose from "mongoose";
import LoadingSpinner from "../../../../components/loadingSpinner";
import Modal from "react-modal";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (
			req.session.userData.role == "manager" &&
			query.transactionID.length == 24
		) {
			await dbConnect();
			let transactionInfo = await Transaction.findOne({
				_id: new mongoose.Types.ObjectId(query.transactionID),
				status: "for negotiation",
			}).lean();
			if (transactionInfo) {
				let priceHistoryList = await PriceHistory.find({
					transactionID: query.transactionID,
				})
					.sort({ updatedAt: -1 })
					.lean();
				let itemList = await Item.find({
					itemListID: transactionInfo.itemListID,
				}).lean();
				let customerInfo = await User.findOne({
					userID: transactionInfo.customerID,
				});
				// console.log("SERVER SIDE PROPS:", itemList);
				return {
					props: {
						currentUser: req.session.userData,
						transactionData: JSON.parse(JSON.stringify(transactionInfo)),
						priceHistory: JSON.parse(JSON.stringify(priceHistoryList)),
						itemData: JSON.parse(JSON.stringify(itemList)),
						customerData: JSON.parse(JSON.stringify(customerInfo)),
					},
				};
			} else {
				return {
					redirect: { destination: "/" },
				};
			}
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

function NegotiationTransactionID({
	currentUser,
	transactionData,
	priceHistory,
	itemData,
	customerData,
}) {
	// console.log("Start item data is:", itemData);
	const [itemList, setItemList] = useState(itemData);
	const [appraisalPrice, setAppraisalPrice] = useState(0);
	const [itemShow, setItemShow] = useState();
	const [priceHistoryShow, setPriceHistoryShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const priceHistoryData = priceHistory.map((history) => {
		return {
			askPrice: history.askPrice,
			appraisalPrice: history.appraisalPrice,
			time: new Date(history.updatedAt).toLocaleTimeString("en-GB"),
		};
	});

	const router = useRouter();
	// console.log("price history:", priceHistory);
	// console.log("item data:", itemData);
	// console.log("customer data:", customerData);

	function deleteItem(id) {
		let newList = itemList.filter((items) => {
			return items.itemID != id;
		});
		setItemList(newList);
	}

	function selectItem(id) {
		console.log("ITEM LIST FROM SELECT IS:", itemList);
		setItemShow(itemList.find((item) => item.itemID == id));
		// console.log("Select Item is:", itemList);
	}

	function setItemDetails(updatedItem) {
		let newList = itemList.map((item) => {
			if (item.itemID == updatedItem.itemID) {
				item = Object.assign(item, updatedItem);
			}
			return item;
		});
		// console.log("Set Item is:", itemList);
		setItemList(newList);
	}

	useEffect(() => {
		// console.log("USE EFFECT:", itemList);
		let sum = 0;
		itemList.forEach((item) => {
			sum += item.price;
		});
		setAppraisalPrice(sum);
	}, [itemList]);

	function cancelForm() {
		console.log("CANCEL FORM");
	}

	function submitForm() {
		console.log("SUBMIT FORM");
		// console.log("item list:", itemList);
		// console.log("price:", appraisalPrice);
		// setLoading(true);
		fetch("/api/pawn/updateItem", {
			method: "POST",
			body: JSON.stringify(itemList),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("DATA IS:", data);
				// if (data == "success") {
				// 	router.replace("/");
				// } else {
				// 	router.reload();
				// }
			});
	}

	function rejectForm() {
		console.log("REJECT FORM");
	}

	return (
		<>
			<LoadingSpinner isLoading={loading}></LoadingSpinner>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
				<Modal isOpen={priceHistoryShow} ariaHideApp={false} className="modal">
					<PriceHistoryModal
						data={priceHistoryData}
						trigger={priceHistoryShow}
						setTrigger={setPriceHistoryShow}
					/>
				</Modal>
				<div className="font-semibold text-center font-dosis">
					<h1 className="text-2xl underline">PAWN</h1>
					<span className="text-lg">Appraisal Details</span>
				</div>
				<div className="flex flex-row w-full h-full gap-10">
					<div className="flex flex-col items-center w-full h-full text-base">
						<span className="font-bold">
							Customer Name:{" "}
							<span className="font-normal">
								{customerData.firstName} {customerData.lastName}
							</span>
						</span>
						<h2 className="mt-20 font-bold text-center">Item List</h2>
						<div className="h-[50vh] overflow-y-scroll w-full bg-gray-100 border-2 p-4 flex flex-col gap-4">
							{itemList.map((item) => (
								<AppraisalItemListCard
									itemID={item.itemID}
									key={item.itemID}
									deleteItem={deleteItem}
									selectItem={selectItem}
									itemName={item.itemName}
									itemType={item.itemType}
									price={item.price}
								></AppraisalItemListCard>
							))}
						</div>
					</div>
					<div className="flex flex-col items-center w-full text-base">
						<span className="flex justify-end w-full pr-[35%] font-normal">
							<span className="mr-2 font-bold">Asking Price: </span>
							Php {priceHistory[0].askPrice}
						</span>
						<button
							className="absolute ml-[30vw] text-sm bg-blue-300"
							onClick={() => setPriceHistoryShow(true)}
						>
							View Price History
						</button>
						<span className="flex justify-end w-full font-normal pr-[35%]">
							<span className="mr-2 font-bold">Appraisal Price: </span>
							Php {appraisalPrice}
						</span>

						<h2 className="mt-10 font-bold text-center">Item Details</h2>
						<div className="h-[50vh] overflow-y-scroll w-full bg-gray-100 border-2 p-4 flex flex-col gap-4">
							<AppraisalItemsDetails
								itemDetails={itemShow}
								setItemDetails={setItemDetails}
							></AppraisalItemsDetails>
						</div>
					</div>
				</div>
				<div className="mt-5 flex flex-row ml-[1180px]">
					<div>
						<button
							className="px-10 mx-2 my-5 text-base text-white bg-gray-300"
							onClick={cancelForm}
						>
							Cancel
						</button>
					</div>
					<div>
						<button
							className="px-10 mx-2 my-5 text-base text-white bg-red-300"
							onClick={rejectForm}
						>
							Reject
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

export default NegotiationTransactionID;
