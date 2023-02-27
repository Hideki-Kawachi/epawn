import React from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";

function Approval() {
	return (
		<>
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<p>For Approval</p>
			</div>
		</>
	);
}

export default Approval;
