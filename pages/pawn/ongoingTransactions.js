import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";

function OngoingTransactions() {
	return (
		<>
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<p>Ongoing Transactions</p>
			</div>
		</>
	);
}

export default OngoingTransactions;
