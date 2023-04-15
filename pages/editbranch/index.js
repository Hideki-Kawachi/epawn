import React, { useEffect } from "react";
import { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../utilities/config";
import dbConnect from "../../utilities/dbConnect";
import NavBar from "../../components/navigation/navBar";
import Header from "../../components/header";

import EmployeeInfo from "../../schemas/employeeInfo";
import Branch from "../../schemas/branch";
import { parse } from "postcss";

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

			let foundBranch = await Branch.findOne({ branchID: empBranch.branchID });

			// console.log("no " + foundBranch.branchID)

			let branchData = JSON.stringify(foundBranch);

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
	const parsedBranch = JSON.parse(branchData);

	const [currentPawnTicketID, setCurrentPawnTicketID] = useState(
		parsedBranch.currentPawnTicketID
	);
	const [endingPawnTicketID, setEndingPawnTicketID] = useState(
		parsedBranch.endingPawnTicketID
	);

	function submitForm() {
		if (
			currentPawnTicketID.length == 0 ||
			endingPawnTicketID.length == 0 ||
			currentPawnTicketID.length != 8 ||
			endingPawnTicketID.length != 8
		) {
			setError(true);

			console.log("Length is 0");
		} else {
			let newBranchInfo = {
				branchID: parsedBranch.branchID,
				currentPawnTicketID: currentPawnTicketID,
				endingPawnTicketID: endingPawnTicketID,
			};

			// console.log(newBranchInfo)

			fetch("/api/editBranchInfo", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newBranchInfo),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data + "hello");
					// setNotifResult(data);
					// if (data != "No Fields Edited") {
					// 	setTimeout(() => window.location.reload(), 800);
					// }
					window.location.reload();
				});
		}
	}

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>

			<div id="not-main-content-area" className="items-start bg-black">
				<div className="flex-col items-start justify-center my-5 font-nunito">
					<span className="text-base">Branch ID: </span>{" "}
					<span className="text-[#FF0000]">*</span>
					<div className="border-2">
						<span className="text-sm"> {parsedBranch.branchID} </span>
					</div>
				</div>
				<div className="flex-col items-start my-5 justify-centerfont-nunito">
					<span className="text-base">Branch Name: </span>{" "}
					<span className="text-[#FF0000]">*</span>
					<div className="border-2">
						<span className="text-sm"> {parsedBranch.branchName} </span>
					</div>
				</div>
				<div className="flex-col items-start my-5 justify-centerfont-nunito">
					<span className="text-base">Branch Address:</span>{" "}
					<span className="text-[#FF0000]">*</span>
					<div className="border-2">
						<span className="text-sm"> {parsedBranch.branchAddress} </span>
					</div>
				</div>
				<div className="flex-col items-start my-5 justify-centerfont-nunito">
					<span className="text-base">Current PT Number: </span>
					<span className="text-[#FF0000] mx-2">*</span>
					<input
						className="px-3 border rounded-md stroke-gray-500"
						type="text"
						id="currentPawnTicketID"
						defaultValue={parsedBranch.currentPawnTicketID}
						onChange={(e) => setCurrentPawnTicketID(e.target.value)}
					/>
				</div>
				<div className="flex-col items-start my-5 justify-centerfont-nunito">
					<span className="text-base">Ending PT Number: </span>
					<span className="text-[#FF0000] mx-2">*</span>
					<input
						className="px-3 border rounded-md stroke-gray-500"
						type="text"
						id="endingPawnTicketID"
						defaultValue={parsedBranch.endingPawnTicketID}
						onChange={(e) => setEndingPawnTicketID(e.target.value)}
					/>
				</div>

				<button
					className=" bg-[#14C6A5] select-none "
					type="button"
					onClick={submitForm}
				>
					<p>Save Changes</p>
				</button>
			</div>
		</>
	);
}

export default EditBranch;
