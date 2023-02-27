import React from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";

function Negotiation() {
	return (
		<>
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<p>For Negotiation</p>
			</div>
		</>
	);
}

export default Negotiation;
