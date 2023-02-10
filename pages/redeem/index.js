import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";

function Redeem() {
	return (
		<>
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<p>Redeem</p>
			</div>
		</>
	);
}

export default Redeem;
