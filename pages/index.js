import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ClerkHome from "../components/home/clerkHome";
import Header from "../components/header";
import ManagerHome from "../components/home/managerHome";
import NavBar from "../components/navigation/navBar";
import dbConnect from "../utilities/dbConnect";
import mongoose from "mongoose";
import NotifTable from "./api/notifTable";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../utilities/config";
import Transaction from "../schemas/transaction";
import EmployeeInfo from "../schemas/employeeInfo";
import Branch from "../schemas/branch";
import Item from "../schemas/item";
import LoadingSpinner from "../components/loadingSpinner";
import User from "../schemas/user";
import PawnTicket from "../schemas/pawnTicket";
import Cashflow from "../schemas/cashflow";
import dayjs from "dayjs";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		//FOR UPDATING ITEMS THAT ARE EXPIRED AND WILL BE FOR AUCTION
		await dbConnect();
		let today = new Date();
		let yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		await PawnTicket.updateMany(
			{
				expiryDate: { $lt: today },
				isInactive: false,
			},
			{ isInactive: true }
		);
		let expiredPT = await PawnTicket.find(
			{ expiryDate: { $gt: yesterday, $lte: today } },
			{ itemListID: 1 }
		);

		for (const pt of expiredPT) {
			await Item.updateMany(
				{ itemListID: pt.itemListID, isRedeemed: false },
				{ forAuction: true }
			);
		}

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
		} else if (req.session.userData.role == "admin") {
			return {
				redirect: { destination: "/cashflow", permanent: true },
				props: {},
			};
		} else {
			let transactionData;
			let customerData = await User.find({}).lean();

			if (req.session.userData.role == "clerk") {
				transactionData = await Transaction.find({
					branchID: req.session.userData.branchID,
					clerkID: req.session.userData.userID,
					status: { $ne: "Done" },
				})
					.sort({ updatedAt: -1 })
					.lean();
			} else if (req.session.userData.role == "manager") {
				transactionData = await Transaction.find({
					branchID: req.session.userData.branchID,
					managerID: req.session.userData.userID,
					status: { $ne: "Done" },
				})
					.sort({ updatedAt: -1 })
					.lean();
			}

			// console.log("trans data:", transactionData);

			let notifData = [];
			transactionData.forEach((transaction) => {
				let customerInfo = customerData.find(
					(customer) => customer.userID == transaction.customerID
				);

				// console.log("CUST INFO:", customerInfo);
				if (customerInfo) {
					notifData.push({
						_id: transaction._id,
						customerName: customerInfo.firstName + " " + customerInfo.lastName,
						date: transaction.updatedAt
							.toDateString()
							.substring(4, transaction.updatedAt.length),
						time: dayjs(transaction.updatedAt).format("h:mm A"),
						transactionType: transaction.transactionType,
						status: transaction.status,
					});
				}
			});
			let morning = new Date().setHours(0, 0, 0, 0);
			let night = new Date().setHours(23, 59, 59, 59);
			let cashflowTransac = await Transaction.find({
				branchID: req.session.userData.branchID,
				createdAt: { $gte: new Date(morning), $lte: new Date(night) },
				status: { $in: ["Done", "Approved"] },
			}).lean();

			let balance = 0;
			let cashIn = 0;
			let cashOut = 0;

			let currCashflow = await Cashflow.findOne({
				branchID: req.session.userData.branchID,
				date: dayjs().format("YYYY-MM-DD"),
			});

			if (currCashflow) {
				balance = currCashflow.beginningBalance;
			}

			for (const cashflow of cashflowTransac) {
				if (
					cashflow.transactionType == "Pawn" ||
					cashflow.transactionType == "Withdraw"
				) {
					cashOut += Math.abs(cashflow.amountPaid);
					//amount paid is negative
					balance += cashflow.amountPaid;
				} else if (
					cashflow.transactionType == "Redeem" ||
					cashflow.transactionType == "Renew" ||
					cashflow.transactionType == "Renew(Online)" ||
					cashflow.transactionType == "Add. Funds"
				) {
					cashIn += cashflow.amountPaid;
					balance += cashflow.amountPaid;
				}
			}

			// console.log("DATE IS:", new Date(morning), "--", new Date(night));
			// console.log("cashflow:", cashflowTransac);

			let cashflowSummary = {
				balance: balance,
				cashIn: cashIn,
				cashOut: cashOut,
			};

			return {
				props: {
					currentUser: req.session.userData,
					notifData: JSON.parse(JSON.stringify(notifData)),
					cashflowSummary: JSON.parse(JSON.stringify(cashflowSummary)),
				},
			};
		}
	},
	ironOptions
);

export default function Home({ currentUser, notifData, cashflowSummary }) {
	const [showData, setShowData] = useState(notifData);

	const roleShow = {
		manager: (
			<ManagerHome
				notifData={showData}
				cashflowSummary={cashflowSummary}
			></ManagerHome>
		),
		clerk: <ClerkHome notifData={showData}></ClerkHome>,
	};

	useEffect(() => {
		waitNotif();
	}, []);

	async function waitNotif() {
		try {
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
				// await waitNotif();
				await new Promise((resolve) => setTimeout(resolve, 1000));
				await waitNotif();
			} else {
				let notifShow = await res.json();
				// console.log("NOTIF DATA BACK IS:", notifShow);
				setShowData(notifShow);
				await waitNotif();
			}
		} catch {
			await waitNotif();
		}
	}

	return (
		<div>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			{roleShow[currentUser.role]}
			{/* <button onClick={() => buttonClick()}>HELLO WORLD</button> */}
		</div>
	);
}
