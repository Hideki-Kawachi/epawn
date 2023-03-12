import React, { useState } from "react";
// import BasicButton from "../BasicButton";

import MockUsers from "../../components/users/User_MOCK_DATA.json";
import ToggleSwitch from "../ToggleSwitch.js";

// function UserEdit(props) or UserEdit(userID, firstName, lastName, password, roleName)
function UserEdit({ data }){

	
	const [userID, setUserID] = useState(data.userID);
	const [firstName, setFirstName] = useState(data.firstName);
	const [lastName, setLastName] = useState(data.lastName);
	const [password, setPassword] = useState(data.password);
	const [roleName, setRoleName] = useState(data.roleName);
	const [isDisabled, setIsDisabled] = useState(data.isDisabled);
	const [error, setError] = useState(false);
	const [employeeIDError, setEmployeeIDError] = useState("");


	function submitForm(){

		let userData = {
			lastName: lastName
		}

		console.log("hello")


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