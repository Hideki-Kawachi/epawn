import React from "react";
import Header from "../../../../components/header";
import NavBar from "../../../../components/navigation/navBar";
import NegotiationTable from "../../../../components/pawn/negotiation/negotiationTable";
import Data from "../../../../components/tempData/negotiationTable.json";

function Negotiation() {
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
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<NegotiationTable columns={columns} data={Data}></NegotiationTable>
			</div>
		</>
	);
}

export default Negotiation;
