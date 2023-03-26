import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ClerkHome from "../../components/home/clerkHome";
import Header from "../../components/header";
import ManagerHome from "../../components/home/managerHome";
import NavBar from "../../components/navigation/navBar";
import dbConnect from "../../utilities/dbConnect";
import mongoose from "mongoose";
import NotifTable from "../api/notifTable";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../utilities/config";
import Transaction from "../../schemas/transaction";
import EmployeeInfo from "../../schemas/employeeInfo";
import Branch from "../../schemas/branch";
import LoadingSpinner from "../../components/loadingSpinner";
import User from "../../schemas/user";

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
			let pawnTicketData;
			let customerData = await User.find({}).lean();

			if (req.session.userData.role == "clerk") {
				transactionData = await Transaction.find({
					branchID: req.session.userData.branchID,
					clerkID: req.session.userData.userID,
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
							.substring(4, transaction.creationDate.length),
						time: transaction.updatedAt.toLocaleTimeString("en-GB"),
						transactionType: transaction.transactionType,
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

export default function Reports({ currentUser, notifData }) {
	const [showData, setShowData] = useState(notifData);

	return (
		<div>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<span>REPORTS</span>
		</div>
	);
}