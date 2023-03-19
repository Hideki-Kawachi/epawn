import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import ReturnTable from "../../../components/pawn/ongoingTransaction/returnTable";
import ReturningCustomerData from "../../../components/tempData/returningCustomer.json";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";
import dbConnect from "../../../utilities/dbConnect";
import User from "../../../schemas/user";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "clerk") {
			await dbConnect();
			let userList = await User.find(
				{ role: "customer", isDisabled: false },
				{ firstName: 1, lastName: 1, middleName: 1, userID: 1 }
			).lean();
			return {
				props: {
					currentUser: req.session.userData,
					returnCustomerData: JSON.parse(JSON.stringify(userList)),
				},
			};
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

function ReturningCustomer({ currentUser, returnCustomerData }) {
	const columns = React.useMemo(
		() => [
			{
				Header: "User ID",
				accessor: "userID",
			},
			{ Header: "First Name", accessor: "firstName" },
			{ Header: "Middle Name", accessor: "middleName" },
			{ Header: "Last Name", accessor: "lastName" },
		],
		[]
	);

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
				<div className="font-semibold text-center font-dosis">
					<h1 className="text-2xl underline">PAWN</h1>
					<span className="text-lg">Returning Customer</span>
				</div>
				<ReturnTable columns={columns} data={returnCustomerData} />
			</div>
		</>
	);
}

export default ReturningCustomer;
