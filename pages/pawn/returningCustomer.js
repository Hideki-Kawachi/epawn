import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";

function ReturningCustomer() {
	return (
		<>
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<p>RETURNING CUSTOMER</p>
			</div>
		</>
	);
}

export default ReturningCustomer;
