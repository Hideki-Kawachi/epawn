import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import NavBar from "../../../components/navigation/navBar";
import Header from "../../../components/header";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";
import UserEdit from "../../../components/users/UserEdit";

import MockUsers from "../../../components/users/User_MOCK_DATA.json";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (
			req.session.userData.role == "admin" ||
			req.session.userData.role == "manager"
		) {
			return {
				props: { currentUser: req.session.userData },
			};
		} else if (req.session.userData.role == "customer") {
			return {
				redirect: { destination: "/customer", permanent: true },
				props: {},
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

function Edit({ currentUser }) {
	const router = useRouter();
	const userid = router.query.userid;

	console.log("userid is:", userid, "--curr is:", currentUser);

	// Add NavBar (currentUser) and Header (currentUser)
	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>

			<div id="main-content-area">
			<div> hello </div>

			<div> Details about {userid} </div>

			{MockUsers.map((mockUser) => {

					//Modify this to String. mockUser.userID == userid.toString()
					if (mockUser.userID == userid) {
						return (
							<UserEdit
								key={mockUser.userID}
								fName={mockUser.firstName}
								lName={mockUser.lastName}
								rName={mockUser.roleName}
								uID={mockUser.userID}
								pass={mockUser.password}
								disabledTrue={mockUser.isDisabled}
							/>
						);
					}
			})}

			</div>

		</>
	);
}

export default Edit;
