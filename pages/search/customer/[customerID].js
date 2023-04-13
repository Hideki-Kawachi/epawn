import dayjs from "dayjs";
import { withIronSessionSsr } from "iron-session/next";
import mongoose from "mongoose";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Header from "../../../components/header";
import ItemCard from "../../../components/itemcard";
import CustomerDetails from "../../../components/modals/customerDetails";
import NavBar from "../../../components/navigation/navBar";
import Branch from "../../../schemas/branch";
import CustomerInfo from "../../../schemas/customerInfo";
import Item from "../../../schemas/item";
import Redeem from "../../../schemas/redeem";
import PawnTicket from "../../../schemas/pawnTicket";
import Transaction from "../../../schemas/transaction";
import User from "../../../schemas/user";
import { ironOptions } from "../../../utilities/config";
import dbConnect from "../../../utilities/dbConnect";
import CashflowTable from "../../../components/cashflow/cashflowTable";
import PawnTicketTable from "../../../components/search/pawnTicketTable";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		if (!req.session.userData && !query) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (
			req.session.userData.role == "manager" ||
			req.session.userData.role == "admin" ||
			(req.session.userData.role == "clerk" && query.customerID.length <= 7)
		) {
			await dbConnect();
			let userInfo = await User.findOne(
				{
					userID: query.customerID,
				},
				{ password: 0 }
			);

			let customerInfo = await CustomerInfo.findOne({
				userID: query.customerID,
			});

			let branchInfo = await Branch.find({});

			let transactionData = await Transaction.find({
				customerID: query.customerID,
				status: "Done",
			})
				.sort({ updatedAt: -1 })
				.lean();
			let cashflowData = [];

			transactionData.forEach((transaction) => {
				if (transaction.amountPaid > 0) {
					cashflowData.push({
						transactionType: transaction.transactionType,
						cashIn: transaction.amountPaid.toFixed(2),
						date: transaction.updatedAt
							.toDateString()
							.substring(4, transaction.creationDate.length),
						time: transaction.updatedAt.toString(),
					});
				} else {
					cashflowData.push({
						transactionType: transaction.transactionType,
						cashOut: Math.abs(transaction.amountPaid).toFixed(2),
						date: transaction.updatedAt
							.toDateString()
							.substring(4, transaction.creationDate.length),
						time: transaction.updatedAt.toString(),
					});
				}
			});

			let pawnTicketInfo = await PawnTicket.find({
				customerID: query.customerID,
			}).lean();

			let pawnTicketList = [];

			for (const pt of pawnTicketInfo) {
				let status = "Active";
				if (pt.isInactive) {
					status = "Inactive";
				}

				pawnTicketList.push({
					pawnTicketID: pt.pawnTicketID,
					loanDate: dayjs(pt.loanDate).format("MMM DD, YYYY"),
					maturityDate: dayjs(pt.maturityDate).format("MMM DD, YYYY"),
					expiryDate: dayjs(pt.expiryDate).format("MMM DD, YYYY"),
					status: status,
				});
			}

			// THIS IS FOR GETTING ITEMS THAT ARE PRESENT AT THE CREATION OF PAWNTICKET
			//
			// let pawnTicketList = [];
			// for (const pt of pawnTicketInfo) {
			// 	console.log("PT IS:", pt);
			// 	let pastPawnTicketInfo = await PawnTicket.find({
			// 		itemListID: pt.itemListID,
			// 		createdAt: { $lt: pt.loanDate },
			// 	})
			// 		.sort({ loanDate: -1 })
			// 		.lean();

			// 	let redeemedItems = [];

			// 	for (const pastPT of pastPawnTicketInfo) {
			// 		let tempRedeem = await Redeem.findOne({
			// 			pawnTicketID: pastPT.pawnTicketID,
			// 		});
			// 		// console.log("temp:", tempRedeem);
			// 		if (tempRedeem) {
			// 			let tempItemsRedeemed = await Item.find({
			// 				redeemID: tempRedeem.redeemID,
			// 				isRedeemed: true,
			// 			}).lean();
			// 			// console.log("item found:", tempItemsRedeemed);
			// 			for (const item of tempItemsRedeemed) {
			// 				redeemedItems.push(item);
			// 			}
			// 		}
			// 	}

			// 	let itemList = await Item.find({
			// 		itemListID: pt.itemListID,
			// 	}).lean();

			// 	let currentItemList = itemList;

			// 	if (redeemedItems) {
			// 		let itemIndex = 0;
			// 		for (const item of itemList) {
			// 			for (const redeemedItem of redeemedItems) {
			// 				if (redeemedItem.itemID == item.itemID) {
			// 					currentItemList.splice(itemIndex, 1);
			// 				}
			// 			}
			// 			itemIndex++;
			// 		}
			// 	}

			// 	pawnTicketList.push({
			// 		pawnTicketData: pt,
			// 		items: currentItemList,
			// 	});
			// }

			if (userInfo) {
				return {
					props: {
						currentUser: req.session.userData,
						branchData: JSON.parse(JSON.stringify(branchInfo)),
						cashflowData: JSON.parse(JSON.stringify(cashflowData)),
						customerData: JSON.parse(JSON.stringify(customerInfo)),
						userData: JSON.parse(JSON.stringify(userInfo)),
						pawnTicketData: JSON.parse(JSON.stringify(pawnTicketList)),
					},
				};
			} else {
				return {
					redirect: { destination: "/", permanent: true },
					props: {},
				};
			}
		} else {
			return {
				redirect: { destination: "/", permanent: true },
				props: {},
			};
		}
	},
	ironOptions
);

function SearchCustomerID({
	currentUser,
	pawnTicketData,
	branchData,
	cashflowData,
	customerData,
	userData,
}) {
	const [showCustomer, setShowCustomer] = useState(false);
	const [showTab, setShowTab] = useState("Customer Info");

	console.log("pt list:", pawnTicketData);
	console.log("customer:", customerData);
	console.log("user: ", userData);

	const displayTab = {
		"Customer Info": (
			<>
				<div className="flex flex-row gap-5 text-sm font-nunito">
					<div className="flex flex-col gap-2 font-semibold text-end">
						<span>First Name:</span>
						<span>Last Name:</span>
						<span>Middle Name:</span>
					</div>
					<div className="flex flex-col gap-2">
						<span>{userData.firstName}</span>
						<span>{userData.lastName}</span>
						<span>{userData.middleName ? userData.middleName : "-------"}</span>
					</div>
					<div className="flex flex-col gap-2 ml-10 font-semibold text-end">
						<span>Sex:</span>
						<span>Status:</span>
					</div>
					<div className="flex flex-col gap-2">
						<span>{customerData.sex ? customerData.sex : "-------"}</span>
						<span>{customerData.status ? customerData.status : "-------"}</span>
					</div>
					<div className="flex flex-col gap-2 ml-10 font-semibold text-end">
						<span>Weight:</span>
						<span>Height:</span>
					</div>
					<div className="flex flex-col gap-2">
						<span>
							{customerData.weight > 0
								? customerData.weight + " kg"
								: "-------"}
						</span>
						<span>
							{customerData.height > 0
								? customerData.height + " cm"
								: "-------"}
						</span>
					</div>
				</div>
				<hr className="mt-5 mb-5 border-gray-500"></hr>
				<div className="flex flex-row gap-5 text-sm font-nunito">
					<div className="flex flex-col gap-2 font-semibold text-end">
						<span>Date of Birth:</span>
						<span>Place of Birth:</span>
						<span>Present Address:</span>
						<span>Permanent Address:</span>
					</div>
					<div className="flex flex-col gap-2">
						<span>{dayjs(customerData.birthDate).format("MMM DD, YYYY")}</span>
						<span>{customerData.birthPlace}</span>
						<span>{customerData.presentAddress}</span>
						<span>
							{userData.permanentAddress
								? userData.permanentAddress
								: "--------------------------"}
						</span>
					</div>
				</div>
				<hr className="mt-5 mb-5 border-gray-500"></hr>
				<div className="flex flex-row gap-5 text-sm font-nunito">
					<div className="flex flex-col gap-2 font-semibold text-end">
						<span>Contact Number:</span>
						<span>Email Address:</span>
						<span>Complexion:</span>
						<span>Identifying Mark:</span>
					</div>
					<div className="flex flex-col gap-2">
						<span>{customerData.contactNumber}</span>
						<span>
							{customerData.email ? customerData.email : "--------------------"}
						</span>
						<span>
							{customerData.complexion
								? customerData.complexion
								: "--------------------"}
						</span>
						<span>
							{customerData.identifyingMark
								? customerData.identifyingMark
								: "--------------------"}
						</span>
					</div>
					<div className="flex flex-col gap-2 ml-10 font-semibold text-end">
						<span>Name of Employer:</span>
						<span>Position:</span>
						<span>Nature of Work:</span>
					</div>
					<div className="flex flex-col gap-2">
						<span>
							{customerData.employerName
								? customerData.employerName
								: "--------------------"}
						</span>
						<span>
							{customerData.jobPosition
								? customerData.jobPosition
								: "--------------------"}
						</span>
						<span>
							{customerData.workNature
								? customerData.workNature
								: "--------------------"}
						</span>
					</div>
				</div>
			</>
		),
		"Transaction History": (
			<>
				<CashflowTable data={cashflowData}></CashflowTable>
			</>
		),
		PawnTickets: (
			<>
				<PawnTicketTable data={pawnTicketData}></PawnTicketTable>
			</>
		),
	};

	useEffect(() => {
		if (showTab == "PawnTickets") {
			document.getElementById("PawnTicket-Details-Tab").style.backgroundColor =
				"white";
			document.getElementById("Customer-Info-Tab").style.backgroundColor =
				"rgb(205 204 202 / var(--tw-bg-opacity))";
			document.getElementById("Transaction-History-Tab").style.backgroundColor =
				"rgb(205 204 202 / var(--tw-bg-opacity))";
		} else if (showTab == "Transaction History") {
			document.getElementById("PawnTicket-Details-Tab").style.backgroundColor =
				"rgb(205 204 202 / var(--tw-bg-opacity))";
			document.getElementById("Customer-Info-Tab").style.backgroundColor =
				"rgb(205 204 202 / var(--tw-bg-opacity))";
			document.getElementById("Transaction-History-Tab").style.backgroundColor =
				"white";
		} else if (showTab == "Customer Info") {
			document.getElementById("PawnTicket-Details-Tab").style.backgroundColor =
				"rgb(205 204 202 / var(--tw-bg-opacity))";
			document.getElementById("Customer-Info-Tab").style.backgroundColor =
				"white";
			document.getElementById("Transaction-History-Tab").style.backgroundColor =
				"rgb(205 204 202 / var(--tw-bg-opacity))";
		}
	}, [showTab]);

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
				<div className="w-3/4 p-5 pb-0 text-base border-2 border-b-0 bg-green-50 font-nunito">
					<div className="flex flex-row justify-between">
						<div className="flex flex-col justify-center h-full item-center">
							<h1 className="text-lg font-bold font-nonito">
								{userData.firstName +
									" " +
									(userData.middleName.length > 0
										? userData.middleName.charAt(0) + " ."
										: " ") +
									userData.lastName}
							</h1>
							<span className="text-base font-semibold">
								User ID: {userData.userID}
							</span>
						</div>
						<div>
							<a
								className="block font-semibold text-right text-green-500 hover:underline hover:text-green-400 hover:cursor-pointer"
								target="_blank"
								href={customerData.validID}
								rel="noopener noreferrer"
							>
								View Valid ID
							</a>
							<a
								className="block font-semibold text-right text-green-500 hover:underline hover:text-green-400 hover:cursor-pointer"
								target="_blank"
								href={customerData.customerInfoSheet}
								rel="noopener noreferrer"
							>
								View Customer Info Sheet
							</a>
						</div>
					</div>
					<div className="flex flex-row gap-5 mt-5 text-sm font-semibold text-green-500">
						<span
							className="p-5 bg-white rounded mb-[-5px] cursor-pointer"
							id="Customer-Info-Tab"
							onClick={() => setShowTab("Customer Info")}
						>
							Customer Info
						</span>
						<span
							className="p-5 bg-white rounded mb-[-5px] cursor-pointer"
							id="Transaction-History-Tab"
							onClick={() => setShowTab("Transaction History")}
						>
							Transaction History
						</span>
						<span
							className="p-5 bg-gray-200 rounded mb-[-5px] cursor-pointer"
							id="PawnTicket-Details-Tab"
							onClick={() => setShowTab("PawnTickets")}
						>
							PawnTickets
						</span>
					</div>
				</div>
				<div className="w-3/4 h-full p-5 bg-white border-2">
					{displayTab[showTab]}
				</div>
			</div>
		</>
	);
}

export default SearchCustomerID;
