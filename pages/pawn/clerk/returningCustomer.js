import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import ReturnTable from "../../../components/pawn/ongoingTransaction/returnTable";
import ReturningCustomerData from "../../../components/tempData/returningCustomer.json";

function ReturningCustomer() {
	const columns = React.useMemo(
		() => [
			{
				Header: "User ID",
				accessor: "userID",
			},
			{ Header: "First Name", accessor: "firstName" },
			{ Header: "Middle Name", accessor: "middleName" },
			{ Header: "Last Name", accessor: "lastName" },
		],
		[]
	);

	return (
		<>
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<div className="font-semibold text-center font-dosis">
					<h1 className="text-2xl underline">PAWN</h1>
					<span className="text-lg">Returning Customer</span>
				</div>
				<ReturnTable columns={columns} data={ReturningCustomerData} />
			</div>
		</>
	);
}

export default ReturningCustomer;
