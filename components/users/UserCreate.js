import React, { useEffect, useState } from "react";
// import BasicButton from "../BasicButton";
// import ToggleSwitch from "../ToggleSwitch";
import Router from "next/router";

import MockUsers from "../../components/users/User_MOCK_DATA.json";

function UserCreate(foundBranchID){

	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [roleName, setRoleName] = useState("Clerk");
	const [isDisabled, setIsDisabled] = useState(true);
	const [branchID, setBranchID] = useState(foundBranchID.foundBranchID);

	const [error, setError] = useState(false);
	const [employeeIDError, setEmployeeIDError] = useState("");

	function isManager(){

		if (foundBranchID.foundBranchID != ""){
			return true;
		}

		return false;
	}

	function submitForm(){

		if (
			firstName.length == 0 ||
			lastName.length == 0 || 
			// middleName.length == 0 ||
			password.length == 0 || 
			branchID.length == 0
		) {
			setError(true);

			console.log("Length is 0")

		}
		 else {
			
			let userData = {
				firstName: firstName,
				middleName: middleName,
				lastName: lastName,
				password: password,
				role: roleName,
				isDisabled: isDisabled,
				branchID: branchID
			}

			console.log(userData)

			// MockUsers.push(userData)

			// console.log(MockUsers)

			fetch("/api/users/createEmployee", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data == "good") {
						console.log("SUCCESS");
						setError(false);
						window.location.reload();

					} else {
						setError(true);
						setEmployeeIDError(data);
						console.log("failed")
					}
				});
		}

		// MockUsers.push( {"userID": userData.userID ,"firstName": userData.firstName, "password": userData.password,
		// "lastName":userData.lastName,"roleName":userData.roleName,"isDisabled":true}
	}

	// [{"userID":1,"lastName":"Bicheno","firstName":"Antonetta","roleName":"Supervisor","disabled":true},
    
    return( 
        <>
        <form className="user-create-main-container">

            <h1 className="m-5 font-bold text-base"> Create New User</h1>

				<div className="user-create-top-container m-5 grid grid-cols-3 gap-4">

					<div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">First Name:<span className="text-red-500">*</span></span>
          				<input className="border rounded-md stroke-gray-500 px-3" 
								type="text"
								id="firstName"
								onChange={(e) => setFirstName(e.target.value)}
						/>
					</div>

					<div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Mid Name:</span>
          				<input className="border rounded-md stroke-gray-500 px-3" 
								type="text"
								id="middleName"
								onChange={(e) => setMiddleName(e.target.value)}
						/>
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Last Name: <span className="text-red-500">*</span> </span>
          				<input className="border rounded-md stroke-gray-500 px-3"
								type="text"
								id="lastName"
								onChange={(e) => setLastName(e.target.value)}
						/>
					</div>

					<div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Role   : <span className="text-red-500">*</span></span>
						{/* Change to Select */}
						<select
							className="border rounded-md stroke-gray-500 px-3"
							onChange={(e) => setRoleName(e.target.value)}
							id="roleName"
						>
						<option value={"clerk"}>Clerk</option>
						<option value={"manager"}>Manager</option>
						<option value={"admin"}>Admin</option>
						<option value={"customer"}>Customer</option>
					</select>
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Password: <span className="text-red-500">*</span> </span>
          				<input className="border rounded-md stroke-gray-500 px-3"
								type="password"
								id="password"
								onChange={(e) => setPassword(e.target.value)}
						 />
					</div>
					   <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Branch ID: <span className="text-red-500">*</span></span>
          				<input className="border rounded-md stroke-gray-500 px-3"
								type="text"
								id="branchID"
								value={branchID}
								disabled={isManager()}
								onChange={(e) => setBranchID(e.target.value)}
						 />
					</div>


					<button className="absolute bottom-5 right-5 bg-[#14C6A5] "
						type="button"
						onClick={submitForm}
					>
						<p>Create User</p>
					</button>
					
				</div>
			</form>

        </>
    )
    
}

export default UserCreate;