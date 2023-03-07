import React from "react";
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
				return {
					props: {
						currentUser: req.session.userData,
						transactionData: JSON.parse(JSON.stringify(transactionInfo)),
						priceHistory: JSON.parse(JSON.stringify(priceHistoryList)),
						itemData: JSON.parse(JSON.stringify(itemList)),
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
}) {
	console.log("transaction Data:", transactionData);
	console.log("price history:", priceHistory);
	console.log("item data:", itemData);
	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
				<p>SDJKLAJSLKDJASKLDJLASK</p>
			</div>
		</>
	);
}

export default AppraisalTransactionID;
