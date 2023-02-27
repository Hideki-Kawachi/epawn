import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";

function Appraisal() {
	return (
		<>
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<p>For Appraisal</p>
			</div>
		</>
	);
}

export default Appraisal;
