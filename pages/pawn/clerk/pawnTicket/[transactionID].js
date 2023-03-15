import { withIronSessionSsr } from "iron-session/next";
import mongoose from "mongoose";
import React, { useState } from "react";
import Header from "../../../../components/header";
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
				})
					.sort({ updatedAt: 1 })
					.lean();
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

function PawnTicketTransactionID({
	currentUser,
	transactionData,
	priceHistory,
	itemData,
	customerData,
}) {
	const [loading, setLoading] = useState(false);
	return (
		<>
			<LoadingSpinner isLoading={loading}></LoadingSpinner>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area"></div>
		</>
	);
}

export default PawnTicketTransactionID;
