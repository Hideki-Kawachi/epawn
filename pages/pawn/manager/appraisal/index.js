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
			let forAppraisal = await Transaction.find({
				branchID: req.session.userData.branchID,
				status: "for appraisal",
			}).lean();
			let customerData = await User.find({ isDisabled: false }).lean();
			let priceHistory = await PriceHistory.find({}).lean();
			let tableData = [];
			forAppraisal.forEach((transaction) => {
				let customerInfo = customerData.find(
					(customer) => customer.userID == transaction.customerID
				);
				let priceInfo = priceHistory.find(
					(priceHistory) => priceHistory.transactionID == transaction._id
				);
				tableData.push({
					transactionID: priceInfo.transactionID,
					customerName: customerInfo.firstName + " " + customerInfo.lastName,
					askPrice: priceInfo.askPrice,
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

function Appraisal({ currentUser, tableData }) {
	const columns = React.useMemo(
		() => [
			{
				Header: "Customer Name",
				accessor: "customerName",
			},
			{ Header: "Ask Price", accessor: "askPrice" },
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
				<AppraisalTable columns={columns} data={tableData}></AppraisalTable>
			</div>
		</>
	);
}

export default Appraisal;
