import React, { useEffect } from "react";
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
import EmployeeInfo from "../../schemas/employeeInfo";

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

			// For Manager

			if (req.session.userData.role == "manager") {
				let manUID = req.session.userData.userID

				const manager = await EmployeeInfo.findOne(
					{manUID},
					{ branchID: 1}
				)

				let foundBranchID = manager.branchID

				const branchUserIDList = await EmployeeInfo.find(
					{ foundBranchID},
					{ userID: 1}
				)

				let tempUIDList = [];


				branchUserIDList.forEach((branchUserID) => {
					tempUIDList.push(branchUserID.userID)
				});

				console.log(tempUIDList)

				userList.forEach( (user) => {
					if (tempUIDList.includes(user.userID))
						tempUserData.push({
							userID: user.userID,
							firstName: user.firstName,
							lastName: user.lastName,
							roleID: user.role,
							isDisabled: user.isDisabled,
						})
				});
			}

			if (req.session.userData.role == "admin") {
				userList.forEach( (user) => {
					tempUserData.push({
						userID: user.userID,
						firstName: user.firstName,
						lastName: user.lastName,
						roleID: user.role,
						isDisabled: user.isDisabled,
					})
				
				});
			}

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
	
	const users = JSON.parse(userData);

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("All");

	const [userShow, setUserShow] = useState(users);
	// const [notifResult, setNotifResult] = useState("");

	useEffect(() => {
		getSearch(search);
	}, [filter]);

	function getSearch(value) {
		let tempList = [];
		users.forEach((user) => {
			if ( 	(user.firstName.toLowerCase().includes(value) 
					|| user.lastName.toLowerCase().includes(value))
					&& (user.roleID == filter || filter == "All") ) {
					tempList.push(user);

				}
		});
		setUserShow(tempList);
	}

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>

			
			<div id="main-content-area">
				<div className="flex items-center justify-center w-1/4 gap-2 my-5 text-base font-nunito">
					<span className="text-base">Search: </span>
					<input
						type="search"
						id="user"
						placeholder={"Name (Press Enter)"}
						className="flex-grow"
						onChange={(e) => {
							setSearch(e.target.value);
							if (e.target.value.length == 0) {
								getSearch("");
							}
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								getSearch(search);
							}
						}}
					/>
					<span className="ml-5">Role: </span>
					<select
						className="h-fit"
						onChange={(e) => setFilter(e.target.value)}
						id="role-filter"
						value={filter}
					>
						<option value={"All"} selected>
							All
						</option>
						<option value={"clerk"}>Clerk</option>
						<option value={"manager"}>Manager</option>
						<option value={"admin"}>Admin</option>
						<option value={"customer"}>Customer</option>
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
								roleName={mockUser.roleID.charAt(0).toUpperCase() + mockUser.roleID.slice(1)}
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
