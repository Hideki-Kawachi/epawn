import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navBar";

function Pawn() {
	return (
		<>
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<p>Pawn</p>
			</div>
		</>
	);
}

export default Pawn;
