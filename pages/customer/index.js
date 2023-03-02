import React from "react";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../utilities/config";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "customer") {
			return {
				props: { currentUser: req.session.userData },
			};
		} else {
			return {
				redirect: { destination: "/", permanent: true },
				props: {},
			};
		}
	},
	ironOptions
);

function Customer({ currentUser }) {
	function logout() {
		fetch("/api/logout");
	}
	return (
		<div>
			<button className="bg-red-300" onClick={() => logout}>
				LOGOUT
			</button>
		</div>
	);
}

export default Customer;
