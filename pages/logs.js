import React from "react";
import Header from "../components/header";
import NavBar from "../components/navigation/navBar";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../utilities/config";
import LogsTable from "../components/logs/logsTable";
import dbConnect from "../utilities/dbConnect";
import Transaction from "../schemas/transaction";
import User from "../schemas/user";
import PawnTicket from "../schemas/pawnTicket";
import Branch from "../schemas/branch";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role != "customer") {
			await dbConnect();
			if (req.session.userData.role == "admin") {
				let transactionInfo = await Transaction.find({
					status: "Done",
					branchID: req.session.userData.branchID,
				})
					.sort({ updatedAt: -1 })
					.lean();
				let userInfo = await User.find(
					{},
					{ userID: 1, firstName: 1, middleName: 1, lastName: 1 }
				).lean();
				let pawnTicketInfo = await PawnTicket.find({
					branchID: req.session.userData.branchID,
				}).lean();
				let branchInfo = await Branch.find({}).lean();

				let tableData = [];

				for (const transaction of transactionInfo) {
					let pawnTicket = pawnTicketInfo.filter((pt) => {
						return pt.transactionID.toString() == transaction._id.toString();
					});
					let branchData = branchInfo.filter((branch) => {
						return branch.branchID == transaction.branchID;
					});
					// console.log("pawnticket", pawnTicket);

					let customerName;
					let clerkName;
					let managerName;
					let index = 0;
					while (
						(!customerName || !clerkName || !managerName) &&
						index < userInfo.length
					) {
						let currUser = userInfo[index];

						if (currUser.userID == transaction.customerID) {
							customerName =
								currUser.firstName +
								" " +
								(currUser.middleName.length > 0
									? currUser.middleName.charAt(0) + ". "
									: " ") +
								currUser.lastName;
						} else if (currUser.userID == transaction.clerkID) {
							clerkName =
								currUser.firstName +
								" " +
								(currUser.middleName.length > 0
									? currUser.middleName.charAt(0) + ". "
									: " ") +
								currUser.lastName;
						} else if (currUser.userID == transaction.managerID) {
							managerName =
								currUser.firstName +
								" " +
								(currUser.middleName.length > 0
									? currUser.middleName.charAt(0) + ". "
									: " ") +
								currUser.lastName;
						}
						index++;
					}

					let cashIn = 0;
					let cashOut = 0;

					if (transaction.amountPaid > 0 && pawnTicket.length == 1) {
						cashIn = transaction.amountPaid;
						tableData.push({
							pawnTicketID: pawnTicket[0].pawnTicketID,
							transactionType: transaction.transactionType,
							customerName: customerName,
							branchName: branchData[0].branchName,
							cashIn: cashIn.toFixed(2),
							cashOut: cashOut.toFixed(2),
							clerkName: clerkName,
							managerName: managerName,
							date: transaction.updatedAt
								.toDateString()
								.substring(4, transaction.updatedAt.length),
							time: transaction.updatedAt.toString(),
						});
					} else {
						for (const pawnPT of pawnTicket) {
							cashOut = Math.abs(pawnPT.loanAmount * 0.0965);
							tableData.push({
								pawnTicketID: pawnPT.pawnTicketID,
								transactionType: transaction.transactionType,
								customerName: customerName,
								branchName: branchData[0].branchName,
								cashIn: cashIn.toFixed(2),
								cashOut: cashOut.toFixed(2),
								clerkName: clerkName,
								managerName: managerName,
								date: transaction.updatedAt
									.toDateString()
									.substring(4, transaction.updatedAt.length),
								time: transaction.updatedAt.toString(),
							});
						}
					}
				}
				return {
					props: {
						currentUser: req.session.userData,
						tableData: JSON.parse(JSON.stringify(tableData)),
						branchData: JSON.parse(JSON.stringify(branchInfo)),
					},
				};
			} else if (req.session.userData.role == "manager") {
				let transactionInfo = await Transaction.find({
					status: "Done",
					branchID: req.session.userData.branchID,
				})
					.sort({ updatedAt: -1 })
					.lean();
				let userInfo = await User.find(
					{},
					{ userID: 1, firstName: 1, middleName: 1, lastName: 1 }
				).lean();
				let pawnTicketInfo = await PawnTicket.find({
					branchID: req.session.userData.branchID,
				}).lean();
				let branchInfo = await Branch.findOne({
					branchID: req.session.userData.branchID,
				});

				let tableData = [];

				for (const transaction of transactionInfo) {
					let pawnTicket = pawnTicketInfo.filter((pt) => {
						return pt.transactionID.toString() == transaction._id.toString();
					});
					// console.log("pawnticket", pawnTicket);

					let customerName;
					let clerkName;
					let managerName;
					let index = 0;
					while (
						(!customerName || !clerkName || !managerName) &&
						index < userInfo.length
					) {
						let currUser = userInfo[index];

						if (currUser.userID == transaction.customerID) {
							customerName =
								currUser.firstName +
								" " +
								(currUser.middleName.length > 0
									? currUser.middleName.charAt(0) + ". "
									: " ") +
								currUser.lastName;
						} else if (currUser.userID == transaction.clerkID) {
							clerkName =
								currUser.firstName +
								" " +
								(currUser.middleName.length > 0
									? currUser.middleName.charAt(0) + ". "
									: " ") +
								currUser.lastName;
						} else if (currUser.userID == transaction.managerID) {
							managerName =
								currUser.firstName +
								" " +
								(currUser.middleName.length > 0
									? currUser.middleName.charAt(0) + ". "
									: " ") +
								currUser.lastName;
						}
						index++;
					}

					let cashIn = 0;
					let cashOut = 0;

					if (transaction.amountPaid > 0 && pawnTicket.length == 1) {
						cashIn = transaction.amountPaid;
						tableData.push({
							pawnTicketID: pawnTicket[0].pawnTicketID,
							transactionType: transaction.transactionType,
							customerName: customerName,
							branchName: branchInfo.branchName,
							cashIn: cashIn.toFixed(2),
							cashOut: cashOut.toFixed(2),
							clerkName: clerkName,
							managerName: managerName,
							date: transaction.updatedAt
								.toDateString()
								.substring(4, transaction.updatedAt.length),
							time: transaction.updatedAt.toString(),
						});
					} else {
						for (const pawnPT of pawnTicket) {
							cashOut = Math.abs(pawnPT.loanAmount * 0.0965);
							tableData.push({
								pawnTicketID: pawnPT.pawnTicketID,
								transactionType: transaction.transactionType,
								customerName: customerName,
								branchName: branchInfo.branchName,
								cashIn: cashIn.toFixed(2),
								cashOut: cashOut.toFixed(2),
								clerkName: clerkName,
								managerName: managerName,
								date: transaction.updatedAt
									.toDateString()
									.substring(4, transaction.updatedAt.length),
								time: transaction.updatedAt.toString(),
							});
						}
					}
				}

				return {
					props: {
						currentUser: req.session.userData,
						tableData: JSON.parse(JSON.stringify(tableData)),
						branchData: JSON.parse(JSON.stringify([branchInfo])),
					},
				};
			} else {
				return {
					redirect: { destination: "/signIn", permanent: true },
					props: {},
				};
			}
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

function Logs({ currentUser, tableData, branchData }) {
	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
				<p className="mb-5 text-xl font-semibold text-green-500 underline font-dosis">
					Transaction Logs
				</p>
				<LogsTable data={tableData} branchData={branchData}></LogsTable>
			</div>
		</>
	);
}

export default Logs;
