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
import dayjs from "dayjs";
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
				status: "For Negotiation",
			}).lean();
			let customerData = await User.find({ role: "customer" }).lean();
			let priceHistory = await PriceHistory.find({})
				.sort({ updatedAt: -1 })
				.lean();
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
					time: transaction.updatedAt.toString(),
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
function convertFloat(number) {
    return (
      "Php " +
      Number(number).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
function Negotiation({ currentUser, tableData }) {
	const columns = React.useMemo(
    () => [
      {
        Header: "Customer Name",
        accessor: "customerName",
      },
      {
        Header: "Ask Price",
        Cell: ({ value }) => {
          return <div className="text-right ml-[-20px] mr-16">{convertFloat(value)}</div>;
        },
        accessor: "askPrice",
      },
      {
        Header: "Appraisal Price",
        Cell: ({ value }) => {
          return (
            <div className="text-right ml-[-20px] mr-16">
              {convertFloat(value)}
            </div>
          );
        },
        accessor: "appraisalPrice",
      },
      { Header: "Date", accessor: "date" },
      {
        Header: "Time",
        Cell: ({ value }) => {
          return dayjs(value).format("h:mm A");
        },
        accessor: "time",
      },
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
				<p className="mb-5 text-lg text-green-500 font-dosis">
					For Negotiation
				</p>
				<NegotiationTable columns={columns} data={tableData}></NegotiationTable>
			</div>
		</>
	);
}

export default Negotiation;
