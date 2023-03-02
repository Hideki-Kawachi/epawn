import React from "react";
import Header from "../../../../components/header";
import NavBar from "../../../../components/navigation/navBar";
import AppraisalTable from "../../../../components/pawn/appraisal/appraisalTable";
import Data from "../../../../components/tempData/appraisalTable.json";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../../utilities/config";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "manager") {
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
				redirect: { destination: "/" },
			};
		}
	},
	ironOptions
);

function Appraisal({ currentUser }) {
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
				<AppraisalTable columns={columns} data={Data}></AppraisalTable>
			</div>
		</>
	);
}

export default Appraisal;
