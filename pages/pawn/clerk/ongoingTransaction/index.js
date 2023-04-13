import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../../../components/header";
import NavBar from "../../../../components/navigation/navBar";
import ReturnTable from "../../../../components/pawn/ongoingTransaction/returnTable";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../../utilities/config";
import dbConnect from "../../../../utilities/dbConnect";
import User from "../../../../schemas/user";
import LoadingSpinner from "../../../../components/loadingSpinner";
import OngoingTable from "../../../../components/pawn/ongoingTransaction/ongoingTable";
import Transaction from "../../../../schemas/transaction";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "customer") {
			return {
				redirect: { destination: "/customer", permanent: true },
				props: {},
			};
		} else {
			await dbConnect();

			let transactionData;
			let customerData = await User.find({}).lean();

			if (req.session.userData.role == "clerk") {
				transactionData = await Transaction.find({
					branchID: req.session.userData.branchID,
					clerkID: req.session.userData.userID,
					transactionType: "Pawn",
					status: { $ne: "Done" },
				})
					.sort({ updatedAt: -1 })
					.lean();
			} else if (
				req.session.userData.role == "manager" ||
				req.session.userData.role == "admin"
			) {
				transactionData = await Transaction.find({
					branchID: req.session.userData.branchID,
					managerID: req.session.userData.userID,
					transactionType: "Pawn",
					status: { $ne: "Done" },
				})
					.sort({ updatedAt: -1 })
					.lean();
			}

			// console.log("trans data:", transactionData);

			let notifData = [];
			transactionData.forEach((transaction) => {
				if (!transaction.status.includes("For")) {
					let customerInfo = customerData.find(
						(customer) => customer.userID == transaction.customerID
					);
					if (customerInfo) {
						notifData.push({
							_id: transaction._id,
							customerName:
								customerInfo.firstName + " " + customerInfo.lastName,
							date: transaction.updatedAt
								.toDateString()
								.substring(4, transaction.creationDate.length),
							time: transaction.updatedAt.toString(),
							transactionType: transaction.transactionType,
							status: transaction.status,
						});
					}
				}
			});

			return {
				props: {
					currentUser: req.session.userData,
					transactionData: JSON.parse(JSON.stringify(notifData)),
				},
			};
		}
	},
	ironOptions
);

function OngoingTransaction({ currentUser, transactionData }) {
	const [loading, setLoading] = useState(false);

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<LoadingSpinner isLoading={loading}></LoadingSpinner>
			<div id="main-content-area">
				<div className="text-center">
					<p className="text-xl font-semibold text-green-500 underline font-dosis">
						Pawn
					</p>
					<p className="mb-5 text-lg text-green-500 font-dosis">
						Ongoing Transactions
					</p>
				</div>
				<OngoingTable data={transactionData} role={currentUser.role} />
			</div>
		</>
	);
}

export default OngoingTransaction;
