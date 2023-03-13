import React, { useEffect, useState } from "react";
// import BasicButton from "../BasicButton";

import MockUsers from "../../components/users/User_MOCK_DATA.json";
import ToggleSwitch from "../ToggleSwitch.js";

// function UserEdit(props) or UserEdit(userID, firstName, lastName, password, roleName)
function UserEdit(foundID){

	
	const [userID, setUserID] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [password, setPassword] = useState("");
	const [roleName, setRoleName] = useState("");
	const [isDisabled, setIsDisabled] = useState("");
	const [branchID, setBranchID] = useState("")

	const [error, setError] = useState(false);
	const [employeeIDError, setEmployeeIDError] = useState("");

	useEffect(() => {
		// console.log("here is the key" + foundID.foundID)

		fetch("/api/users/" + foundID.foundID, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				// console.log("RECEIVED DATA:", data);
				setUserID(data.userID)
				setFirstName(data.firstName);
				setMiddleName(data.middleName);
				setLastName(data.lastName);
				setPassword(data.password);
				setRoleName(data.role);
				setBranchID(data.branchID);
				setIsDisabled(data.isDisabled);
			});


			// For Branch Fetch
			// fetch("/api/users/" + foundID.foundID, {
			// 	method: "GET",
			// 	headers: {
			// 		Accept: "application/json",
			// 		"Content-Type": "application/json",
			// 	},
			// })
			// 	.then((res) => res.json())
			// 	.then((data) => {
			// 		// console.log("RECEIVED DATA:", data);
			// 		setBranchID(data.branchID)
			// 	});


	}, [foundID.foundID])


	function submitForm(){

		if (
			firstName.length == 0 ||
			lastName.length == 0 || 
			password.length == 0 ||
			roleName.length == 0
		) {
			setError(true);

			console.log("Length is 0")
		}  else {
			
			let userData = {
				userID: userID,
				firstName: firstName,
				middleName: middleName,
				lastName: lastName,
				password: password,
				role: roleName,
				isDisabled: isDisabled,
				branchID: branchID
			}

			console.log(userData)

			fetch("/api/users/editUser", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			})
			.then((res) => res.json())
			.then((data) => {

					console.log(data + "hello")
					// setNotifResult(data);
					// if (data != "No Fields Edited") {
					// 	setTimeout(() => window.location.reload(), 800);
					// }
				});

		}


	} 
    
    return( 
        <>
        <form className="user-create-main-container">

            <h1 className="m-5 font-bold text-base"> Edit User</h1>

				<div className="user-create-top-container m-5 grid grid-cols-3 gap-4">

                    <div className="flex w-1/4 flex-col select-none">
						<span className="font-bold pr-7">UserID: </span>
          				<input 
						  	className="border rounded-md stroke-gray-500 px-3"
							type="text"
							id="userID"
							defaultValue={userID}
							onChange={(e) => setUserID(e.target.value)}
							disabled
						/>
					</div>

                    <div className="flex w-1/4 flex-col select-none">
						<span className="font-bold pr-7">First Name: </span>
          				<input className="border rounded-md stroke-gray-500 px-3" 
								type="text"
								id="firstName"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
						/>
					</div>

                    <div className="flex w-1/4 flex-col select-none">
						<span className="font-bold pr-7">Role   : </span>
          				<input className="border rounded-md stroke-gray-500 px-3"
							type="text"
							id="roleName"
							value={roleName}
							onChange={(e) => setRoleName(e.target.value)}
						/>
					</div>

                    <div className="flex w-1/4 flex-col select-none">
						<span className="font-bold pr-7">Password: </span>
          				<input className="border rounded-md stroke-gray-500 px-3"
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
						 />
					</div>

					<div className="flex w-1/4 flex-col select-none">
						<span className="font-bold pr-7">Middle Name: </span>
          				<input className="border rounded-md stroke-gray-500 px-3"
								type="text"
								id="middleName"
								value={middleName}
								onChange={(e) => setMiddleName(e.target.value)}
						/>
					</div>


                    <div className="flex w-1/4 flex-col select-none">
						<span className="font-bold pr-7">Last Name: </span>
          				<input className="border rounded-md stroke-gray-500 px-3"
								type="text"
								id="lastName"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
						/>
					</div>

					<div className="flex w-1/4 flex-col select-none">
						<span className="font-bold pr-7">Enabled: </span>
								<ToggleSwitch
									disabled={isDisabled}
									setDisabled={setIsDisabled}
								></ToggleSwitch>
					</div>

					<div className="flex w-1/4 flex-col select-none">
						<span className="font-bold pr-7">BranchID  : </span>
          				<input className="border rounded-md stroke-gray-500 px-3"
							type="text"
							id="branchID"
							value={branchID}
							onChange={(e) => setBranchID(e.target.value)}
						/>
					</div>



					<button className="absolute bottom-5 right-5 bg-[#14C6A5] select-none "
						type="button"
						onClick={submitForm}
					>
						<p>Save Changes</p>
					</button>
					
				</div>
			</form>


        </>
    )
    
}

export default UserEdit;