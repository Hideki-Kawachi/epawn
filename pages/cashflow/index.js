import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";
import dbConnect from "../../utilities/dbConnect";
import mongoose, { set } from "mongoose";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../utilities/config";
import Transaction from "../../schemas/transaction";
import Branch from "../../schemas/branch";
import Cashflow from "../../schemas/cashflow";
import CashflowTable from "../../components/cashflow/cashflowTable";
import CashflowSummary from "../../components/cashflow/cashflowSummary";
import Modal from "react-modal";
import BeginningBalance from "../../components/modals/beginningBalance";
import EndingBalance from "../../components/modals/endingBalance";
import AdditionalFunds from "../../components/modals/additionalFunds";
import WithdrawFunds from "../../components/modals/withdrawFunds";
import dayjs from "dayjs";

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
			let cashflowInfo;
			let branchData = await Branch.find({}).lean();

			if (req.session.userData.role == "manager") {
				transactionData = await Transaction.find({
					branchID: req.session.userData.branchID,
					status: "Done",
				})
					.sort({ updatedAt: -1 })
					.lean();

				cashflowInfo = await Cashflow.findOne({
					branchID: req.session.userData.branchID,
					date: dayjs(new Date()).format("YYYY-MM-DD"),
				});
			} else if (req.session.userData.role == "admin") {
				transactionData = await Transaction.find({
					status: "Done",
				})
					.sort({ updatedAt: -1 })
					.lean();

				cashflowInfo = await Cashflow.find({
					date: dayjs(new Date()).format("YYYY-MM-DD"),
				});
			}

			let cashflowData = [];
			let beginningBalance = null;
			let pawnTotal = 0;
			let redeemTotal = 0;
			let renewTotal = 0;
			let additionalFunds = 0;
			let withdrawals = 0;
			let currentBalance = 0;

			if (cashflowInfo) {
				if (cashflowInfo.length > 1) {
					cashflowInfo.forEach((cashflow) => {
						beginningBalance += cashflow.beginningBalance;
					});
				} else {
					beginningBalance = cashflowInfo.beginningBalance;
				}
			}

			transactionData.forEach((transaction) => {
				if (transaction.amountPaid > 0) {
					cashflowData.push({
						transactionType: transaction.transactionType,
						cashIn: transaction.amountPaid.toFixed(2),
						date: transaction.updatedAt
							.toDateString()
							.substring(4, transaction.creationDate.length),
						time: transaction.updatedAt.toLocaleTimeString("en-GB"),
					});
				} else {
					cashflowData.push({
						transactionType: transaction.transactionType,
						cashOut: Math.abs(transaction.amountPaid).toFixed(2),
						date: transaction.updatedAt
							.toDateString()
							.substring(4, transaction.creationDate.length),
						time: transaction.updatedAt.toLocaleTimeString("en-GB"),
					});
				}
				if (transaction.transactionType == "Pawn") {
					pawnTotal += Math.abs(transaction.amountPaid);
				} else if (transaction.transactionType == "Redeem") {
					redeemTotal += transaction.amountPaid;
				} else if (transaction.transactionType.includes("Renew")) {
					renewTotal += transaction.amountPaid;
				} else if (transaction.transactionType == "Add. Funds") {
					additionalFunds += transaction.amountPaid;
				} else if (transaction.transactionType == "Withdraw") {
					withdrawals += Math.abs(transaction.amountPaid);
				}

				if (transaction.transasctionType != "Ending Balance") {
					currentBalance += transaction.amountPaid;
				}
			});

			let cashflowSummary = {
				beginningBalance: beginningBalance,
				pawn: pawnTotal,
				redeem: redeemTotal,
				renew: renewTotal,
				additionalFunds: additionalFunds,
				withdraw: withdrawals,
				currentBalance: currentBalance,
			};

			return {
				props: {
					currentUser: req.session.userData,
					notifData: JSON.parse(JSON.stringify(cashflowData)),
					branchData: JSON.parse(JSON.stringify(branchData)),
					cashflowSummary: JSON.parse(JSON.stringify(cashflowSummary)),
				},
			};
		}
	},
	ironOptions
);

export default function CashflowIndex({
	currentUser,
	notifData,
	branchData,
	cashflowSummary,
}) {
	const currentDate = dayjs(new Date()).format("YYYY-MM-DD");
	const [showData, setShowData] = useState(notifData);
	const [begShow, setBegShow] = useState(
		cashflowSummary.beginningBalance ? false : true
	);
	const [endShow, setEndShow] = useState(false);
	const [addShow, setAddShow] = useState(false);
	const [withdrawShow, setWithdrawShow] = useState(false);

	return (
		<div>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<Modal isOpen={begShow} ariaHideApp={false} className="modal">
				<BeginningBalance
					showModal={setBegShow}
					branches={branchData}
					currentUser={currentUser}
					isNeeded={cashflowSummary.beginningBalance ? false : true}
					date={currentDate}
				></BeginningBalance>
			</Modal>
			<Modal isOpen={endShow} ariaHideApp={false} className="modal">
				<EndingBalance
					showModal={setEndShow}
					branches={branchData}
					currentUser={currentUser}
					balance={cashflowSummary.currentBalance}
					date={currentDate}
				></EndingBalance>
			</Modal>
			<Modal isOpen={addShow} ariaHideApp={false} className="modal">
				<AdditionalFunds
					showModal={setAddShow}
					branches={branchData}
					currentUser={currentUser}
				></AdditionalFunds>
			</Modal>
			<Modal isOpen={withdrawShow} ariaHideApp={false} className="modal">
				<WithdrawFunds
					showModal={setWithdrawShow}
					branches={branchData}
					currentUser={currentUser}
				></WithdrawFunds>
			</Modal>
			<div id="main-content-area">
				<div className="flex flex-row w-full h-full gap-5 mt-10">
					<div className="flex flex-col w-3/4 gap-5">
						<CashflowTable data={notifData}></CashflowTable>
						<CashflowSummary
							cashflowSummary={cashflowSummary}
						></CashflowSummary>
					</div>
					<div className="flex flex-col items-center w-1/4 gap-5 p-5 bg-white border-2 border-gray-500 rounded font-nunito">
						<h1 className="text-lg font-semibold">Functions</h1>
						<button
							className="text-base bg-green-300"
							onClick={() => setBegShow(true)}
						>
							Beginning balance
						</button>
						<button
							className="text-base bg-green-300"
							onClick={() => setEndShow(true)}
						>
							Ending Balance
						</button>
						<button
							className="text-base bg-green-300"
							onClick={() => setAddShow(true)}
						>
							Additional Funds
						</button>

						<button
							className="text-base bg-green-300"
							onClick={() => setWithdrawShow(true)}
						>
							Withdraw Funds
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
