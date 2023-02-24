import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";
import UserCard from "../../components/users/UserCard";
import { useState } from "react";


function Users() {

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
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<p>Users</p>

                <div className="flex items-center justify-center w-1/4 gap-2 my-5 text-base font-nunito">
				<span className="text-base">Search: </span>
				<input
					className="flex-grow"
					onChange={(e) => {
						// setGlobalFilter(e.target.value);
                        e.target.value
					}}
					placeholder={"Name"}
				/>
				<span className="ml-5">Role: </span>
				<select
					className="h-fit"
					onChange={(e) =>  e.target.value}
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

				<div id="users-card"  className="drop-shadow-lg flex text-base font-nunito pr-10">
					<div className="m-10">
						{/* <h1 className=""> hello</h1> */}
					</div>
				</div>

				<div>
					<div className="m-5"></div>
				</div>

				<div id="create-card"  className="drop-shadow-lg flex text-base font-nunito pr-100">
					<div className="m-10">
						<UserCard firstName={"Sulletta"} lastName={"Mercury"} roleName={"Manager"}></UserCard>
						{/* <h1 className=""> hello</h1> */}
						{/* {userShow.map((user) => (
								<UserCard
									key={user.userID}
									userID={user.userID}
									firstName={user.firstName}
									lastName={user.lastName}
									roleName={user.roleName}
									disabled={user.disabled}
									setViewing={setIsViewing}
									setEditing={setIsEditing}
								></UserCard>
						))} */}
					</div>
				</div>
			</div>
		</>
	);
}

export default Users;