import React from "react";
import Header from "../../../../components/header";
import NavBar from "../../../../components/navigation/navBar";
import AppraisalTable from "../../../../components/pawn/appraisal/appraisalTable";
import Data from "../../../../components/tempData/appraisalTable.json";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../../utilities/config";
import dbConnect from "../../../../utilities/dbConnect";
import Transaction from "../../../../schemas/transaction";
import User from "../../../../schemas/user";
import PriceHistory from "../../../../schemas/priceHistory";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "manager") {
			await dbConnect();
			let forApproval = await Transaction.find({
				branchID: req.session.userData.branchID,
				status: "For Approval",
			}).lean();
			let customerData = await User.find({ role: "customer" }).lean();
			let priceHistory = await PriceHistory.find({})
				.sort({ updatedAt: -1 })
				.lean();
			let tableData = [];

			forApproval.forEach((transaction) => {
				let customerInfo = customerData.find(
					(customer) => customer.userID == transaction.customerID
				);
				let priceInfo = priceHistory.find(
					(history) => history.transactionID == transaction._id.toString()
				);
				tableData.push({
					transactionID: priceInfo.transactionID,
					customerName: customerInfo.firstName + " " + customerInfo.lastName,
					totalLoanAmount: priceInfo.appraisalPrice,
					date: transaction.updatedAt
						.toDateString()
						.substring(4, transaction.creationDate.length),
					time: transaction.updatedAt.toLocaleTimeString("en-GB"),
				});
			});
			return {
				props: { currentUser: req.session.userData, tableData: tableData },
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

function Approval({ currentUser, tableData }) {
	const columns = React.useMemo(
		() => [
			{
				Header: "Customer Name",
				accessor: "customerName",
			},
			{ Header: "Total Loan Amount", accessor: "totalLoanAmount" },
			{ Header: "Date", accessor: "date" },
			{ Header: "Time", accessor: "time" },
		],
		[]
	);

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
				<p className="text-xl font-semibold text-green-500 underline font-dosis">
					Pawn
				</p>
				<p className="mb-5 text-lg text-green-500 font-dosis">For Approval</p>
				<AppraisalTable
					columns={columns}
					data={tableData}
					screen={"approval"}
				></AppraisalTable>
			</div>
		</>
	);
}

export default Approval;
