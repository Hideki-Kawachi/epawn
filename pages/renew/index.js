import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";

function Renew() {
	return (
		<>
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<p>Renew</p>
			</div>
		</>
	);
}

export default Renew;
