import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";

function ReturningCustomer() {
	return (
		<>
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<span>ReturningCustomer</span>
			</div>
		</>
	);
}

export default ReturningCustomer;
