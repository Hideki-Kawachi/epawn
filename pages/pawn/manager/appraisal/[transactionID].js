import React, { useEffect, useState } from "react";
import Header from "../../../../components/header";
import NavBar from "../../../../components/navigation/navBar";
import AppraisalTable from "../../../../components/pawn/appraisal/appraisalTable";
import Data from "../../../../components/tempData/appraisalTable.json";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../../utilities/config";
import { Router } from "next/router";
import Transaction from "../../../../schemas/transaction";
import Item from "../../../../schemas/item";
import PriceHistory from "../../../../schemas/priceHistory";
import dbConnect from "../../../../utilities/dbConnect";
import User from "../../../../schemas/user";
import AppraisalItemListCard from "../../../../components/pawn/appraisal/appraisalItemListCard";
import AppraisalItemsDetails from "../../../../components/pawn/appraisal/appraisalItemDetails";

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
			let transactionInfo = await Transaction.findById(
				query.transactionID
			).lean();
			if (transactionInfo) {
				let priceHistoryList = await PriceHistory.find({
					transactionID: query.transactionID,
				}).lean();
				let itemList = await Item.find({
					itemListID: transactionInfo.itemListID,
				}).lean();
				let customerInfo = await User.findOne({
					userID: transactionInfo.customerID,
				});
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

function AppraisalTransactionID({
	currentUser,
	transactionData,
	priceHistory,
	itemData,
	customerData,
}) {
	const [itemList, setItemList] = useState(itemData);
	const [appraisalPrice, setAppraisalPrice] = useState("0.00");
	const [itemShow, setItemShow] = useState();
	console.log("transaction Data:", transactionData);
	console.log("price history:", priceHistory);
	console.log("item data:", itemData);
	console.log("customer data:", customerData);

	function deleteItem(id) {
		let newList = itemList.filter((items) => {
			return items.itemID != id;
		});
		setItemList(newList);
	}

	function selectItem(id) {
		setItemShow(
			itemList.find((item) => {
				return item.itemID == id;
			})
		);
	}

	function setItemDetails(updatedItem) {
		let newList = itemList.map((item) => {
			if (item.itemID == updatedItem.itemID) {
				item.itemName = updatedItem.itemName;
				item.itemType = updatedItem.itemType;
				item.itemPrice = updatedItem.itemPrice;
			}
			return item;
		});
		setItemList(newList);
	}

	useEffect(() => {
		console.log("ITEM SHOW IS:", itemShow);
	}, [itemShow]);

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
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
									itemPrice={item.itemPrice}
								></AppraisalItemListCard>
							))}
						</div>
					</div>
					<div className="flex flex-col items-center w-full text-base">
						<span className="flex justify-end w-full pr-[35%] font-normal">
							<span className="mr-2 font-bold">Asking Price: </span>
							Php 1,000.00
						</span>
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
			</div>
		</>
	);
}

export default AppraisalTransactionID;
