import React from "react";
import Header from "../../../../components/header";
import NavBar from "../../../../components/navigation/navBar";
import NegotiationTable from "../../../../components/pawn/negotiation/negotiationTable";
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
				status: "for negotiation",
			}).lean();
			let customerData = await User.find({ isDisabled: false }).lean();
			let priceHistory = await PriceHistory.find({}).lean();
			let tableData = [];
			forAppraisal.forEach((transaction) => {
				let customerInfo = customerData.find(
					(customer) => customer.userID == transaction.customerID
				);
				let priceInfo = priceHistory.find(
					(history) => history.transactionID == transaction._id.toString()
				);
				tableData.push({
					transactionID: priceInfo.transactionID,
					customerName: customerInfo.firstName + " " + customerInfo.lastName,
					askPrice: priceInfo.askPrice,
					appraisalPrice: priceInfo.appraisalPrice,
					date: transaction.updatedAt
						.toDateString()
						.substring(4, transaction.creationDate.length),
					time: transaction.updatedAt.toLocaleTimeString("en-GB"),
				});
				console.log("tableData:", tableData);
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

function Negotiation({ currentUser, tableData }) {
	const columns = React.useMemo(
		() => [
			{
				Header: "Customer Name",
				accessor: "customerName",
			},
			{ Header: "Ask Price", accessor: "askPrice" },
			{ Header: "Appraisal Price", accessor: "appraisalPrice" },
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
				<NegotiationTable columns={columns} data={tableData}></NegotiationTable>
			</div>
		</>
	);
}

export default Negotiation;
