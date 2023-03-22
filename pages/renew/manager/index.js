import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import dbConnect from "../../../utilities/dbConnect";
import mongoose from "mongoose";
import NotifTable from "../../api/notifTable";
import RenewTable from "../../../components/renew/renewTable";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";
import Transaction from "../../../schemas/transaction";
import Renew from "../../../schemas/renew";
import User from "../../../schemas/user";

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
			let renewData;
			let customerData = await User.find({ isDisabled: false }).lean();

			transactionData = await Transaction.find({
				branchID: req.session.userData.branchID,
				managerID: req.session.userData.userID,
				transactionType: { $regex: "Renew" },
				status: { $ne: "done" },
			})
				.sort({ updatedAt: -1 })
				.lean();

			renewData = await Renew.find({}).lean();

			// console.log("trans data: ", transactionData);
			//console.log("renew data: ", renewData);

			let notifData = [];
			transactionData.forEach((transaction) => {
				let customerInfo = customerData.find(
					(customer) => customer.userID == transaction.customerID
				);
				//looks for PT number of that transaction
				renewData.forEach((renew) => {
					if (renew.transactionID == transaction._id) {
						transaction.ptNumber = renew.prevPawnTicketID;
					}
				});

				if (customerInfo) {
					notifData.push({
						_id: transaction._id,
						customerName: customerInfo.firstName + " " + customerInfo.lastName,
						date: transaction.updatedAt
							.toDateString()
							.substring(4, transaction.creationDate.length),
						time: transaction.updatedAt.toLocaleTimeString("en-GB"),
						transactionType: transaction.transactionType,
						ptNumber: transaction.ptNumber,
						amountPaid: "Php " + convertFloat(transaction.amountPaid),
						status: transaction.status,
					});
				}
			});
			return {
				props: {
					currentUser: req.session.userData,
					notifData: JSON.parse(JSON.stringify(notifData)),
				},
			};
		}
	},
	ironOptions
);

function convertFloat(number) {
	return Number(number).toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export default function Home({ currentUser, notifData }) {
	const [showData, setShowData] = useState(notifData);

	useEffect(() => {
		waitNotif();
	}, [showData]);

	async function waitNotif() {
		let res = await fetch("/api/notifTable", {
			method: "GET",
			headers: {
				userID: currentUser.userID,
				branchID: currentUser.branchID,
				role: currentUser.role,
			},
		});

		if (res.status == 502) {
			await waitNotif();
		} else if (res.status != 200) {
			// console.log("2-RESPONSE:", res.statusText);
			//   await waitNotif();
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} else {
			let notifShow = await res.json();
			// console.log("NOTIF DATA BACK IS:", notifShow);
			setShowData(notifShow);

			await waitNotif();
		}
	}

	return (
		<>
			<div>
				<Head>
					<title>E-Pawn: Renewals</title>
					<meta
						name="description"
						content="R. Raymundo Pawnshop Information System"
					/>
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<NavBar currentUser={currentUser}></NavBar>
				<Header currentUser={currentUser}></Header>

				<div id="main-content-area">
					<p className="text-xl font-semibold text-green-500 underline font-dosis">
						Renew
					</p>
					<p className="mb-5 text-lg text-green-500 font-dosis">
						Ongoing Renewals
					</p>
					{/* <button onClick={() => buttonClick()}>HELLO WORLD</button> */}
					<RenewTable role={"manager"} data={notifData}></RenewTable>
				</div>
			</div>
		</>
	);
}
