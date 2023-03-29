import React, { useEffect, useState } from "react";
import Header from "../../../../components/header";
import NavBar from "../../../../components/navigation/navBar";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../../utilities/config";
import dbConnect from "../../../../utilities/dbConnect";
import Transaction from "../../../../schemas/transaction";
import Item from "../../../../schemas/item";
import User from "../../../../schemas/user";
import mongoose from "mongoose";
import PawnTicket from "../../../../schemas/pawnTicket";
import Modal from "react-modal";
import CustomerDetails from "../../../../components/modals/customerDetails";
import CustomerInfo from "../../../../schemas/customerInfo";
import dayjs from "dayjs";
import Branch from "../../../../schemas/branch";
import PawnTicketCard from "../../../../components/pawn/pawnTicketCard";
import LoadingSpinner from "../../../../components/loadingSpinner";
import printPawnTicket from "../../../../utilities/printPawnTicket";
import printItemID from "../../../../utilities/printItemID";
import { useRouter } from "next/router";
import ItemCard from "../../../../components/itemcard";
import PriceHistory from "../../../../schemas/priceHistory";

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
				status: "Rejected",
			}).lean();
			if (transactionInfo) {
				let itemList = await Item.find({
					itemListID: transactionInfo.itemListID,
				}).lean();

				let priceHistoryInfo = await PriceHistory.find({
					transactionID: query.transactionID,
				})
					.sort({ updatedAt: -1 })
					.lean();

				let userInfo = await User.findOne({
					userID: transactionInfo.customerID,
				});
				return {
					props: {
						currentUser: req.session.userData,
						transactionData: JSON.parse(JSON.stringify(transactionInfo)),
						itemData: JSON.parse(JSON.stringify(itemList)),
						userData: JSON.parse(JSON.stringify(userInfo)),
						priceHistoryData: JSON.parse(JSON.stringify(priceHistoryInfo)),
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

function RejectedTransactionID({
	currentUser,
	transactionData,
	itemData,
	userData,
	priceHistoryData,
}) {
	// console.log("pawnticket details:", pawnTicketData);
	// console.log("customer details:", customerData);
	console.log("price history details:", priceHistoryData);
	// console.log("transaction details:", transactionData);

	const [loading, setLoading] = useState(false);
	const router = useRouter();

	function submitForm() {
		setLoading(true);
		fetch("/api/pawn/removePawnTransaction", {
			method: "POST",
			body: JSON.stringify({
				transactionID: transactionData._id,
				itemListID: transactionData.itemListID,
				customerID: userData.userID,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setLoading(false);
				if (data == "success") {
					router.replace("/");
				} else {
					console.log("ERROR DATA:", data);
				}
			});
	}

	return (
		<>
			<LoadingSpinner isLoading={loading}></LoadingSpinner>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
				<div className="text-center">
					<p className="text-xl font-semibold text-green-500 underline font-dosis">
						Pawn
					</p>
					<p className="mb-5 text-lg text-green-500 font-dosis">Rejected</p>
				</div>
				<div className="flex flex-row w-3/4 gap-5 mt-10 text-base">
					<div className="flex flex-col justify-start w-full p-5 bg-white">
						<span>
							<b>Customer Name:</b> {userData.firstName} {userData.lastName}
						</span>
						<span className="mb-5">
							<b>Asking Price:</b> Php {priceHistoryData[0].askPrice.toFixed(2)}
						</span>
						<span className="font-bold">Item List:</span>
						<div className="overflow-y-scroll border-2">
							{itemData.map((item) => (
								<ItemCard key={item.itemID} itemDetails={item}></ItemCard>
							))}
						</div>
					</div>
					<div className="flex flex-col justify-start w-full gap-5 p-5 text-base bg-white">
						<span className="font-bold">Reason for Rejection:</span>
						<span className="p-2 border-2 bg-gray-150">
							{transactionData.rejectionMessage}
						</span>
					</div>
				</div>

				<div className="flex justify-end w-full gap-5 mt-10 text-base mr-28">
					<button
						className="px-10 mx-2 my-5 bg-green-300"
						type="button"
						onClick={() => submitForm(itemData)}
					>
						Done
					</button>
				</div>
			</div>
		</>
	);
}

export default RejectedTransactionID;
