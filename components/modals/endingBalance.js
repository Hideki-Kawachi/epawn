import { useRouter } from "next/router";
import React, { useState } from "react";
import Close from "../closebutton";

function EndingBalance({ showModal, branches, currentUser, balance, date }) {
	const [selectedBranch, setSelectedBranch] = useState(currentUser.branchID);
	const [amount, setAmount] = useState(balance);
	const router = useRouter();

	function submitForm() {
		console.log("submit form");
		showModal(false);
		fetch("/api/cashflow/setEndingBalance", {
			method: "POST",
			body: JSON.stringify({
				amount: amount,
				branchID: selectedBranch,
				managerID: currentUser.userID,
				date: date,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("data is:", data);
				router.reload();
			});
	}

	return (
		<div id="modal-content-area">
			<div className="flex flex-col items-center justify-center px-10 pt-10 pb-10 text-sm bg-gray-100 border-2 rounded-xl min-w-fit">
				<div className="ml-[615px] mb-5" onClick={() => showModal(false)}>
					<Close />
				</div>
				<h1 className="text-base font-bold">Set Ending Balance</h1>
				<div className="flex flex-row gap-2 mt-5">
					<div className="flex flex-col items-end gap-3">
						<span>Branch Selected: </span>
						<span>Amount: </span>
					</div>
					<div className="flex flex-col gap-2">
						<select
							onChange={(e) => setSelectedBranch(e.target.value)}
							className="text-sm"
							disabled={currentUser.role != "admin"}
						>
							{branches.map((branch) => (
								<option key={branch.branchID} value={branch.branchID}>
									{branch.branchName}
								</option>
							))}
						</select>
						<input
							type="number"
							value={amount}
							onChange={(e) => setAmount(parseFloat(e.target.value))}
						></input>
					</div>
				</div>
				<button
					className="mt-5 text-sm bg-green-300"
					onClick={() => submitForm()}
				>
					Save
				</button>
			</div>
		</div>
	);
}

export default EndingBalance;
