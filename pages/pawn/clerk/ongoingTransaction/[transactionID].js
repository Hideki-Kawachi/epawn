import { withIronSessionSsr } from "iron-session/next";
import mongoose from "mongoose";
import React, { useState } from "react";
import Header from "../../../../components/header";
import ItemCard from "../../../../components/itemcard";
import LoadingSpinner from "../../../../components/loadingSpinner";
import NavBar from "../../../../components/navigation/navBar";
import Item from "../../../../schemas/item";
import PriceHistory from "../../../../schemas/priceHistory";
import Transaction from "../../../../schemas/transaction";
import User from "../../../../schemas/user";
import { ironOptions } from "../../../../utilities/config";
import dbConnect from "../../../../utilities/dbConnect";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (
			req.session.userData.role == "clerk" &&
			query.transactionID.length == 24
		) {
			await dbConnect();
			let transactionInfo = await Transaction.findOne({
				_id: new mongoose.Types.ObjectId(query.transactionID),
				status: "appraised",
			}).lean();
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

function OngoingTransactionTransactionID({
	currentUser,
	transactionData,
	priceHistory,
	itemData,
	customerData,
}) {
	const [loading, setLoading] = useState(false);
	const [askPrice, setAskPrice] = useState(
		priceHistory[priceHistory.length - 1].askPrice
	);

	console.log("transact data:", transactionData);
	console.log("price hist:", priceHistory);
	console.log("item Da:", itemData);
	console.log("customer Da:", customerData);
	return (
		<>
			<LoadingSpinner isLoading={loading}></LoadingSpinner>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
				<div className="font-semibold text-center font-dosis">
					<h1 className="text-2xl underline">PAWN</h1>
				</div>
				<div className="flex flex-row w-full gap-10">
					<span className="w-full text-base font-bold text-center font-nunito">
						Customer Name:{" "}
						<span className="font-normal">
							{customerData.firstName} {customerData.lastName}
						</span>
					</span>

					<div className="flex flex-col items-center w-full text-base ">
						<span className="flex justify-end w-full pr-[35%] font-normal">
							<span className="mr-2 font-bold">Asking Price: </span>
							Php
							<input
								className="w-40 ml-2 text-end"
								type="number"
								value={askPrice}
								onChange={(e) => setAskPrice(e.target.value)}
							></input>
						</span>
						<span className="flex justify-end w-full font-normal pr-[35%]">
							<span className="mr-2 font-bold">Appraisal Price: </span>
							Php {priceHistory[priceHistory.length - 1].appraisalPrice}
						</span>
					</div>
				</div>
				<div className="w-1/2 bg-green-50">
					<span className="mr-2 text-base font-bold">Item List: </span>
					<div className="overflow-y-scroll bg-white h-[55vh]">
						{itemData.map((item) => (
							<ItemCard key={item.itemID} itemDetails={item}></ItemCard>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export default OngoingTransactionTransactionID;
