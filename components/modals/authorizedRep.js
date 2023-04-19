import React from "react";
import Close from "../closebutton";
import { useState, useEffect } from "react";

function AuthorizedRep({
	trigger,
	setTrigger,
	authRep,
	setAuthRep,
	authRepID,
	setAuthRepID,
	authStatus,
	setAuthStatus,
	authProof,
	setAuthProof,
}) {
	const [filled, setFilled] = useState(true);
	const [fName, setfName] = useState("");
	const [mName, setmName] = useState("");
	const [lName, setlName] = useState("");
	const [imageError, setImageError] = useState(false);

	function closeModal() {
		setTrigger(!trigger);
		// console.log("Auth scanned is now: " + scanned);
	}

	useEffect(() => {
		if (authRepID) {
			if (!authRepID.type.toString().includes("image")) {
				setImageError(true);
			} else {
				setImageError(false);
			}
		}

		if (authProof) {
			if (!authProof.type.toString().includes("image")) {
				setImageError(true);
			} else {
				setImageError(false);
			}
		}

		if (fName != "" && lName != "" && authRepID && authProof) {
			setFilled(true);
		} else {
			setFilled(false);
		}
	}, [fName, lName, authRepID, authProof]);

	function saveButton() {
		if (filled) {
			setAuthRep([{ fName: fName, mName: mName, lName: lName }]);
			setAuthStatus(true);
			setTrigger(!trigger);
			setFilled(true);
		} else setFilled(false);
	}

	return (
		<>
			<div id="modal-content-area">
				<div className="px-20 pt-10 pb-10 bg-gray-100 border-2 rounded-xl min-w-fit">
					<div className="ml-[650px] mb-5" onClick={closeModal}>
						<Close />
					</div>

					<p className="text-base text-center font-nunito">
						Details of Authorized Representative to <b> redeem</b>
					</p>
					<div className="flex flex-row text-sm font-nunito">
						<div className="mt-5 font-bold text-right">
							<p className="mb-3">
								First Name: <span className="text-red-500">*</span>
							</p>
							<p className="mb-3 mr-3.5">Middle Name:</p>
							<p className="mb-3">
								Last Name: <span className="text-red-500">*</span>
							</p>
							<p className="mb-3">
								Valid ID: <span className="text-red-500">*</span>{" "}
							</p>
							<p className="mb-3">
								Scanned Authorization: <span className="text-red-500">*</span>
							</p>
						</div>
						<div className="mt-5 ml-5 text-left">
							<input
								type="text"
								className="block mb-2"
								value={fName}
								onChange={(e) => setfName(e.target.value)}
							></input>
							<input
								type="text"
								value={mName}
								className="block mb-2"
								onChange={(e) => setmName(e.target.value)}
							></input>
							<input
								type="text"
								className="block mb-2"
								value={lName}
								onChange={(e) => setlName(e.target.value)}
							></input>
							<input
								type="file"
								accept="image/*"
								className="block mb-2"
								//value={scanned}
								onChange={(e) => setAuthRepID(e.target.files[0])}
							></input>
							<input
								type="file"
								accept="image/*"
								className="block mb-2"
								//value={validID}
								onChange={(e) => setAuthProof(e.target.files[0])}
							></input>{" "}
							<p className="text-gray-300">
								{" "}
								only accepts .png and .jpeg files
							</p>
							<p className="text-gray-300"> Max file size: 5 MB</p>
							{imageError ? (
								<span className="font-bold text-center text-red-400">
									Upload image files only!
								</span>
							) : (
								<></>
							)}
						</div>
					</div>

					{/* Buttons */}
					<div className="flex flex-row ">
						<div className="">
							{" "}
							<p className="mt-10 text-sm font-nunito">
								All fields marked with <span className="text-red-500">* </span>
								are required.{" "}
							</p>
							{filled == false ? (
								<p className="text-sm font-nunito ">
									Some <b>required fields</b> are still empty.
								</p>
							) : (
								<></>
							)}
						</div>
						<div className="ml-20 ">
							<button
								className="px-8 mx-2 mt-10 text-base bg-red-300"
								onClick={closeModal}
							>
								Cancel
							</button>
							<button
								className="px-10 mx-2 mt-10 text-base bg-green-300"
								onClick={saveButton}
								disabled={!filled || imageError}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
export default AuthorizedRep;
