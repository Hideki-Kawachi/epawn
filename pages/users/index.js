import React from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";


function Users() {
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
			</div>
		</>
	);
}

export default Users;