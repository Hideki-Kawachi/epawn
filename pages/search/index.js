import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../utilities/config";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role != "customer") {
			return {
				props: { currentUser: req.session.userData },
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

function Search({ currentUser }) {
	const [showTab, setShowTab] = useState("PawnTicket");

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
		PawnTicket: <span>Pawn Ticket</span>,
		Customer: <span>Customer</span>,
		Items: <span>Items</span>,
	};

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
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
