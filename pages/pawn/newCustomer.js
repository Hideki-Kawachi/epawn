import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";

function NewCustomer() {
	return (
		<>
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<p>NEW CUSTOMER</p>
			</div>
		</>
	);
}

export default NewCustomer;
