import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";
import UserCard from "../../components/users/UserCard";
import UserCreate from "../../components/users/UserCreate";
import { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../utilities/config";
import dbConnect from "../../utilities/dbConnect";

import MockUsers from "../../components/users/User_MOCK_DATA.json";
import User from "../../schemas/user";

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

			await dbConnect();

			const userList = await User.find(
				{},
				{ userID: 1, firstName: 1, lastName: 1, role: 1, isDisabled: 1}
			)

			var tempUserData = [];

			userList.forEach( (user) => {
				tempUserData.push({
					userID: user.userID,
					firstName: user.firstName,
					lastName: user.lastName,
					roleID: user.role,
					isDisabled: user.isDisabled,
				})
			});
			// const res = await fetch("../components/users/User_MOCK_DATA.json")
  			// const MockUsers = await res.json()

			let userData = JSON.stringify(tempUserData);

			// console.log(userData);

			return {
				props: { currentUser: req.session.userData, userData},
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

function Users({ currentUser, userData}) {

	// const [userList, setUserList] = useState(MockUsers);
	
	const users = JSON.parse(userData);
	// const roles = JSON.parse(roleData);

	// const users = JSON.parse()

	// const

	// const [search, setSearch] = useState("");
	// const [filter, setFilter] = useState("All");
	// const [rightShow, setRightShow] = useState("button");
	// const [isEditing, setIsEditing] = useState("");
	// const [isViewing, setIsViewing] = useState("");
	const [userShow, setUserShow] = useState(users);
	// const [notifResult, setNotifResult] = useState("");

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>

			
			<div id="main-content-area">
				<div className="flex items-center justify-center w-1/4 gap-2 my-5 text-base font-nunito">
					<span className="text-base">Search: </span>
					<input
						className="flex-grow"
						onChange={(e) => {
							// setGlobalFilter(e.target.value);
							e.target.value;
						}}
						placeholder={"Name"}
					/>
					<span className="ml-5">Role: </span>
					<select
						className="h-fit"
						onChange={(e) => e.target.value}
						//onChange={(e) => setFilter("role", e.target.value)} - used for tables
					>
						<option value={""} selected>
							All
						</option>
						<option value={"Clerk"}>Clerk</option>
						<option value={"Manager"}>Manager</option>
						<option value={"Admin"}>Admin</option>
						<option value={"Customer"}>Customer</option>
					</select>
				</div>

				{/* <UserCard firstName={"Sulletta"} lastName={"Mercury"} roleName={"Manager"}></UserCard> */}

				<div className="grid grid-cols-3 m-10 overflow-y-scroll bg-white h-60">
					{userShow.map((mockUser) => {
						return (
							<UserCard
								key={mockUser.userID}
								firstName={mockUser.firstName}
								lastName={mockUser.lastName}
								roleName={mockUser.roleID}
								userID={mockUser.userID}
								isDisabled={mockUser.isDisabled}
							></UserCard>
						);
					})}
				</div>

				<div className="relative w-full m-10 bg-white h-60">
					<UserCreate></UserCreate>

				</div>
			</div>
		</>
	);
}

export default Users;
