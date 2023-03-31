import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../utilities/config";
import dbConnect from "../../utilities/dbConnect";
import PawnTicket from "../../schemas/pawnTicket";
import User from "../../schemas/user";
import Item from "../../schemas/item";
import Branch from "../../schemas/branch";
import PawnTicketSearch from "../../components/search/pawnTicketSearch";
import CustomerSearch from "../../components/search/customerSearch";
import ItemSearch from "../../components/search/itemSearch";
import Transaction from "../../schemas/transaction";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (
			req.session.userData.role == "admin" ||
			req.session.userData.role == "manager" ||
			req.session.userData.role == "clerk"
		) {
			await dbConnect();

			let pawnTicketInfo = await PawnTicket.find({})
				.sort({ loanDate: -1 })
				.lean();

			let transactionInfo = await Transaction.find({}).lean();

			let userInfo = await User.find(
				{ isDisabled: false },
				{
					userID: 1,
					role: 1,
					firstName: 1,
					middleName: 1,
					lastName: 1,
				}
			).lean();

			let itemInfo = await Item.find({}).sort({ itemID: -1 }).lean();

			let branchInfo = await Branch.find({}).lean();

			return {
				props: {
					currentUser: req.session.userData,
					transactionData: JSON.parse(JSON.stringify(transactionInfo)),
					pawnTicketData: JSON.parse(JSON.stringify(pawnTicketInfo)),
					userData: JSON.parse(JSON.stringify(userInfo)),
					itemData: JSON.parse(JSON.stringify(itemInfo)),
					branchData: JSON.parse(JSON.stringify(branchInfo)),
				},
			};
		} else if (req.session.userData.role == "customer") {
			return {
				redirect: { destination: "/customer", permanent: true },
				props: {},
			};
		} else {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		}
	},
	ironOptions
);

function Search({
	currentUser,
	pawnTicketData,
	userData,
	itemData,
	branchData,
	transactionData,
}) {
	const [showTab, setShowTab] = useState("PawnTicket");

	// console.log("PT DATA:", pawnTicketData);
	// console.log("USER DATA:", userData);
	// console.log("ITEM DATA:", itemData);
	// console.log("BRANCH DATA:", branchData);
	// console.log("TRANSACTION DATA:", transactionData);

	useEffect(() => {
		if (showTab == "PawnTicket") {
			document.getElementById("PawnTicket-Tab").style.backgroundColor = "white";
			document.getElementById("Customer-Tab").style.backgroundColor =
				"rgb(205 204 202 / var(--tw-bg-opacity))";
			document.getElementById("Items-Tab").style.backgroundColor =
				"rgb(205 204 202 / var(--tw-bg-opacity))";
		} else if (showTab == "Customer") {
			document.getElementById("PawnTicket-Tab").style.backgroundColor =
				"rgb(205 204 202 / var(--tw-bg-opacity))";
			document.getElementById("Customer-Tab").style.backgroundColor = "white";
			document.getElementById("Items-Tab").style.backgroundColor =
				"rgb(205 204 202 / var(--tw-bg-opacity))";
		} else if (showTab == "Items") {
			document.getElementById("PawnTicket-Tab").style.backgroundColor =
				"rgb(205 204 202 / var(--tw-bg-opacity))";
			document.getElementById("Customer-Tab").style.backgroundColor =
				"rgb(205 204 202 / var(--tw-bg-opacity))";
			document.getElementById("Items-Tab").style.backgroundColor = "white";
		}
	}, [showTab]);

	const displayTab = {
		PawnTicket: (
			<PawnTicketSearch
				pawnTicketData={pawnTicketData}
				userData={userData}
				itemData={itemData}
				branchData={branchData}
				transactionData={transactionData}
			></PawnTicketSearch>
		),
		Customer: (
			<CustomerSearch
				userData={userData}
				transactionData={transactionData}
				pawnTicketData={pawnTicketData}
				itemData={itemData}
			></CustomerSearch>
		),
		Items: (
			<ItemSearch
				pawnTicketData={pawnTicketData}
				userData={userData}
				itemData={itemData}
			></ItemSearch>
		),
	};

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
				<p className="text-xl font-semibold text-green-500 underline font-dosis">
					Search
				</p>
				<div className="w-full h-full">
					<div className="flex flex-row gap-4 text-base font-semibold text-green-500">
						<div
							id="PawnTicket-Tab"
							className="p-3 bg-gray-200 border-2 rounded cursor-pointer w-fit"
							onClick={() => setShowTab("PawnTicket")}
						>
							PawnTicket
						</div>
						<div
							id="Customer-Tab"
							className="p-3 bg-gray-200 border-2 rounded cursor-pointer w-fit"
							onClick={() => setShowTab("Customer")}
						>
							Customer
						</div>
						<div
							id="Items-Tab"
							className="p-3 bg-gray-200 border-2 rounded cursor-pointer w-fit"
							onClick={() => setShowTab("Items")}
						>
							Items
						</div>
					</div>
				</div>
				<div className="w-full h-full bg-white border-2 mt-[-5px] p-5">
					{displayTab[showTab]}
				</div>
			</div>
		</>
	);
}

export default Search;
