import React from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "manager") {
			return {
				props: { currentUser: req.session.userData },
			};
		} else {
			return {
				redirect: { destination: "/" },
			};
		}
	},
	ironOptions
);

function Approval({ currentUser }) {
	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
				<p>For Approval</p>
			</div>
		</>
	);
}

export default Approval;
