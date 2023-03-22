import React, { useEffect } from "react";
import { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../utilities/config";
import dbConnect from "../../utilities/dbConnect";
import NavBar from "../../components/navigation/navBar";
import Header from "../../components/header";

import EmployeeInfo from "../../schemas/employeeInfo";
import Branch from "../../schemas/branch";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "manager") {
			await dbConnect();
			let empBranch = await EmployeeInfo.findOne(
				{ userID: req.session.userData.userID },
				{ branchID: 1 }
			);

			// console.log("benlo " + empBranch.branchID)

			let foundBranch = await Branch.findOne({ branchID: empBranch.branchID });

			// console.log("iz data UwU " + branchData)

			let branchData = JSON.stringify(foundBranch);

			// branchData.push({
			//     branchID: foundBranch.branchID,
			//     branchName: foundBranch.branchName,
			//     branchAddress: foundBranch.branchAddress,
			//     currentPawnTicketID: foundBranch.currentPawnTicketID,
			//     endingPawnTicketID: foundBranch.endingPawnTicketID
			// })

			return {
				props: { currentUser: req.session.userData, branchData },
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

function EditBranch({ currentUser, branchData }) {
	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>

			{console.log("enlo" + branchData.branchName)}

			<div id="not-main-content-area" className="items-start bg-black">
				<div className="flex-col items-start justify-center my-5 font-nunito">
					<span className="text-base">Branch ID: </span>{" "}
					<span className="text-[#FF0000]">*</span>
					<div className="border-2">
						<span className="text-sm"> 1 </span>
					</div>
				</div>
				<div className="flex-col items-start my-5 justify-centerfont-nunito">
					<span className="text-base">Branch Name: </span>{" "}
					<span className="text-[#FF0000]">*</span>
					<div className="border-2">
						<span className="text-sm"> {"Sta. Ana (Temp)"} </span>
					</div>
				</div>
				<div className="flex-col items-start my-5 justify-centerfont-nunito">
					<span className="text-base">Branch Address:</span>{" "}
					<span className="text-[#FF0000]">*</span>
					<div className="border-2">
						<span className="text-sm">
							{" "}
							{
								"3411 New Panaderos Ext, Santa Ana, Manila, 1009 Metro Manila"
							}{" "}
						</span>
					</div>
				</div>
				<div className="flex-col items-start my-5 justify-centerfont-nunito">
					<span className="text-base">Current Pawn Ticket ID: </span>
					<span className="text-[#FF0000] mx-2">*</span>
					<div>
						<select>
							<option value="A-000000">A-000000</option>
							<option value="B-000000">B-000000</option>
							<option value="C-000000">C-000000</option>
							<option value="D-000000">D-000000</option>
							<option value="E-000000">E-000000</option>
						</select>
					</div>
				</div>
				<div className="flex-col items-start my-5 justify-centerfont-nunito">
					<span className="text-base">Ending Pawn Ticket ID: </span>
					<span className="text-[#FF0000] mx-2">*</span>
					<div>
						<select>
							<option value="A-999999">A-999999</option>
							<option value="B-999999">B-999999</option>
							<option value="C-999999">C-999999</option>
							<option value="D-999999">D-999999</option>
							<option value="E-999999">E-999999</option>
						</select>
					</div>
				</div>
			</div>
		</>
	);
}

export default EditBranch;
