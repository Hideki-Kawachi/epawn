import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";
import UserCard from "../../components/users/UserCard";
import { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../utilities/config";

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
		} else {
			return {
				redirect: { destination: "/", permanent: true },
				props: {},
			};
		}
	},
	ironOptions
);

function Users({ currentUser }) {
	// const users = JSON.parse(userData);
	// const roles = JSON.parse(roleData);

	// const users = JSON.parse()

	// const

	// const [search, setSearch] = useState("");
	// const [filter, setFilter] = useState("All");
	// const [rightShow, setRightShow] = useState("button");
	// const [isEditing, setIsEditing] = useState("");
	// const [isViewing, setIsViewing] = useState("");
	// const [userShow, setUserShow] = useState(users);
	// const [notifResult, setNotifResult] = useState("");

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
				<p>Users</p>

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
					<UserCard
						firstName={"Sulletta"}
						lastName={"Mercury"}
						role={"Branch Manager"}
					></UserCard>
					<UserCard
						firstName={"Sulletta"}
						lastName={"Mercury"}
						role={"Branch Manager"}
					></UserCard>
					<UserCard
						firstName={"Sulletta"}
						lastName={"Mercury"}
						role={"Branch Manager"}
					></UserCard>
					<UserCard
						firstName={"Sulletta"}
						lastName={"Mercury"}
						role={"Branch Manager"}
					></UserCard>
					<UserCard
						firstName={"Sulletta"}
						lastName={"Mercury"}
						role={"Branch Manager"}
					></UserCard>
					<UserCard
						firstName={"Sulletta"}
						lastName={"Mercury"}
						role={"Branch Manager"}
					></UserCard>
					<UserCard
						firstName={"Sulletta"}
						lastName={"Mercury"}
						role={"Branch Manager"}
					></UserCard>
					<UserCard
						firstName={"Sulletta"}
						lastName={"Mercury"}
						role={"Branch Manager"}
					></UserCard>
				</div>
			</div>
		</>
	);
}

export default Users;
