import React from "react";
import Header from "../../../../components/header";
import NavBar from "../../../../components/navigation/navBar";
import NegotiationTable from "../../../../components/pawn/negotiation/negotiationTable";
import Data from "../../../../components/tempData/negotiationTable.json";
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
		} else {
			return {
				redirect: { destination: "/" },
			};
		}
	},
	ironOptions
);

function Negotiation({ currentUser }) {
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
				<NegotiationTable columns={columns} data={Data}></NegotiationTable>
			</div>
		</>
	);
}

export default Negotiation;
