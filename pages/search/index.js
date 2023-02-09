import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navBar";

function Search() {
	return (
		<>
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<p>Search</p>
			</div>
		</>
	);
}

export default Search;
