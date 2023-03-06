import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ClerkHome from "../components/home/clerkHome";
import Header from "../components/header";
import ManagerHome from "../components/home/managerHome";
import NavBar from "../components/navigation/navBar";
import dbConnect from "../utilities/dbConnect";
import mongoose from "mongoose";
import Test from "../schemas/test";
import NotifTable from "./api/notifTable";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../utilities/config";
import Transaction from "../schemas/transaction";
import EmployeeInfo from "../schemas/employeeInfo";
import Branch from "../schemas/branch";
import LoadingSpinner from "../components/loadingSpinner";

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
			if (req.session.userData.role == "clerk") {
				transactionData = await Transaction.find({
					branchID: req.session.userData.branchID,
					clerkID: req.session.userData.userID,
					status: { $ne: "Done" },
				}).lean();
			} else if (req.session.userData.role == "manager") {
				transactionData = await Transaction.find({
					branchID: req.session.userData.branchID,
					managerID: req.session.userData.userID,
					status: { $ne: "Done" },
				}).lean();
			}

			//console.log("TRANS DATA:", transactionData);
			return {
				props: {
					currentUser: req.session.userData,
					notifData: JSON.parse(JSON.stringify(transactionData)),
				},
			};
		}
	},
	ironOptions
);

export default function Home({ currentUser, notifData }) {
	const [showData, setShowData] = useState({});
	//console.log("CURRENT USER IS:", currentUser);
	//console.log("NOTIF DATA FROM SERVERSIDEPROPS IS:", notifData);

	const roleShow = {
		manager: <ManagerHome></ManagerHome>,
		clerk: <ClerkHome></ClerkHome>,
	};

	useEffect(() => {
		waitNotif();
	}, []);

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
			//setShowData(message);

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
