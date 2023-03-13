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
import LoadingSpinner from "../components/loadingSpinner";
import User from "../schemas/user";

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
			let customerData = await User.find({ isDisabled: false }).lean();

			if (req.session.userData.role == "clerk") {
				transactionData = await Transaction.find({
					branchID: req.session.userData.branchID,
					clerkID: req.session.userData.userID,
					status: { $ne: "Done" },
				}).lean();
			} else if (
				req.session.userData.role == "manager" ||
				req.session.userData.role == "admin"
			) {
				transactionData = await Transaction.find({
					branchID: req.session.userData.branchID,
					managerID: req.session.userData.userID,
					status: { $ne: "Done" },
				})
					.sort({ updatedAt: -1 })
					.lean();
			}

			let notifData = [];
			transactionData.forEach((transaction) => {
				let customerInfo = customerData.find(
					(customer) => customer.userID == transaction.customerID
				);
				notifData.push({
					_id: transaction._id,
					customerName: customerInfo.firstName + " " + customerInfo.lastName,
					date: transaction.updatedAt
						.toDateString()
						.substring(4, transaction.creationDate.length),
					time: transaction.updatedAt.toLocaleTimeString("en-GB"),
					transactionType: transaction.transactionType,
					status: transaction.status,
				});
			});

			return {
				props: {
					currentUser: req.session.userData,
					notifData: JSON.parse(JSON.stringify(notifData.reverse())),
				},
			};
		}
	},
	ironOptions
);

export default function Home({ currentUser, notifData }) {
	const [showData, setShowData] = useState(notifData);

	const roleShow = {
		manager: <ManagerHome notifData={showData}></ManagerHome>,
		clerk: <ClerkHome notifData={showData}></ClerkHome>,
	};

	useEffect(() => {
		waitNotif();
		console.log("ASKDL:");
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
			console.log("2-RESPONSE:", res.statusText);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} else {
			let notifShow = await res.json();
			console.log("NOTIF DATA BACK IS:", notifShow);
			setShowData(notifShow);

			await waitNotif();
		}
	}

	return (
		<div>
			<Head>
				<title>E-Pawn</title>
				<meta
					name="description"
					content="R. Raymundo Pawnshop Information System"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			{roleShow[currentUser.role]}
			{/* <button onClick={() => buttonClick()}>HELLO WORLD</button> */}
		</div>
	);
}
