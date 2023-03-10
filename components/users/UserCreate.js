import React, { useState } from "react";
// import BasicButton from "../BasicButton";
// import ToggleSwitch from "../ToggleSwitch";

import MockUsers from "../../components/users/User_MOCK_DATA.json";

function UserCreate(){

	const [userID, setUserID] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [roleName, setRoleName] = useState("Null Role");
	const [isDisabled, setIsDisabled] = useState(false);

	const [error, setError] = useState(false);
	const [employeeIDError, setEmployeeIDError] = useState("");

	function submitForm(){

		let userData = {
			userID: userID,
			firstName: firstName,
			lastName: lastName,
			password: password,
			roleName: roleName,
			isDisabled: isDisabled
		}

		// console.log(lastName)
		console.log(userData)

		// MockUsers.push( {"userID": 69 ,"lastName": firstName,"firstName":lastName,"roleName":roleName,"disabled":true})

		// {MockUsers.map((mockUser => {
		// 	console.log(mockUser.id)

		// }))}
	}

	// [{"userID":1,"lastName":"Bicheno","firstName":"Antonetta","roleName":"Supervisor","disabled":true},
    
    return( 
        <>
        <form className="user-create-main-container">

            <h1 className="m-5 font-bold text-base"> Create New User</h1>

				<div className="user-create-top-container m-5 grid grid-cols-3 gap-4">

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Username: </span>
          				<input 
						  	className="border rounded-md stroke-gray-500 px-3"
							type="text"
							id="userID"
							onChange={(e) => setUserID(e.target.value)}
						/>
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">First Name: </span>
          				<input className="border rounded-md stroke-gray-500 px-3" 
								type="text"
								id="firstName"
								onChange={(e) => setFirstName(e.target.value)}
						/>
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Role   : </span>
          				<input className="border rounded-md stroke-gray-500 px-3"
							type="text"
							id="roleName"
							onChange={(e) => setRoleName(e.target.value)}
						/>
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Password: </span>
          				<input className="border rounded-md stroke-gray-500 px-3"
								type="password"
								id="password"
								onChange={(e) => setPassword(e.target.value)}
						 />
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Last Name: </span>
          				<input className="border rounded-md stroke-gray-500 px-3"
								type="text"
								id="lastName"
								onChange={(e) => setLastName(e.target.value)}
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