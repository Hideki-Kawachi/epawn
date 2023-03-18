import Close from "../closebutton";
import Image from "next/image";
import React from "react";
function CustomerDetails({ trigger, setTrigger, customerInfo, userInfo }) {
	function closeModal() {
		setTrigger(!trigger);
	}
	return (
		<>
			<div id="modal-content-area">
				{/* Modal Window */}
				<div className="flex flex-col px-5 py-5 bg-gray-100 border-2 rounded-xl min-w-fit">
					{/* Close Button Row */}
					<div className="ml-[680px] mb-5" onClick={closeModal}>
						<Close />
					</div>

					{/* Header Row Start */}
					<div className="flex flex-row p-5 border-2 border-b-0 rounded-t-lg header bg-green-50 ">
						{/* User Profile Pic flexbox */}
						{/* User Details flexbox */}
						<div className="mt-3">
							<p className="text-base font-bold text-left font-nunito">
								{userInfo.firstName +
									" " +
									userInfo.middleName +
									" " +
									userInfo.lastName}
							</p>
							<span className="text-base font-bold text-left font-nunito">
								User ID:
							</span>
							<span className="ml-3 text-base text-left font-nunito">
								{customerInfo.userID}
							</span>
							<p className=" mt-5 mb-[-20px] font-nunito font-bold bg-white w-fit p-2">
								{" "}
								Customer Info{" "}
							</p>
						</div>
						<div className="ml-32 mt-[69px] font-dosis text-sm">
							<a
								className="block font-semibold text-right text-green-500 hover:underline hover:text-green-400 hover:cursor-pointer"
								target="_blank"
								href={customerInfo.validID}
								rel="noopener noreferrer"
							>
								View Valid ID
							</a>
							<a
								className="block font-semibold text-right text-green-500 hover:underline hover:text-green-400 hover:cursor-pointer"
								target="_blank"
								href={customerInfo.customerInfoSheet}
								rel="noopener noreferrer"
							>
								View Customer Info Sheet
							</a>
						</div>
					</div>
					{/* Header Row End */}
					<div className="flex-row p-5 bg-white border-2 border-t-0 rounded-b-lg">
						{/* Primary Customer Details */}
						<div className="flex flex-row">
							{/* Name*/}
							<div className="font-bold text-right font-nunito">
								<p>First Name:</p>
								<p>Last Name:</p>
								<p>Middle Name:</p>
							</div>

							<div className="mx-5 text-left">
								<p>{userInfo.firstName}</p>
								<p>{userInfo.middleName}</p>
								<p>{userInfo.lastName}</p>
							</div>
							{/* Name*/}
							<div className="font-bold text-right font-nunito">
								<p>Sex:</p>
								<p>Status:</p>
							</div>

							<div className="mx-5 text-left">
								<p>{customerInfo.sex}</p>
								<p>{customerInfo.status}</p>
							</div>
							{/* BMI */}
							<div className="font-bold text-right font-nunito">
								<p>Height:</p>
								<p>Weight:</p>
							</div>

							<div className="mx-5 text-left">
								<p>{customerInfo.height} cm</p>
								<p>{customerInfo.weight} kg</p>
							</div>
						</div>

						<hr className="h-px my-5 bg-gray-300 border-0" />
						{/* Customer Date/Location Details */}
						<div className="flex flex-row">
							{/* Name*/}
							<div className="font-bold text-right font-nunito">
								<p>Date of Birth:</p>
								<p>Place of Birth:</p>
								<p>Present Address:</p>
								<p>Permanent Address:</p>
							</div>

							<div className="mx-5 text-left">
								<p>{customerInfo.birthDate}</p>
								<p>{customerInfo.birthPlace}</p>
								<p>{customerInfo.presentAddress}</p>
								<p>{customerInfo.permanentAddress}</p>
							</div>
						</div>

						<hr className="h-px my-5 bg-gray-300 border-0" />

						{/* Other Details */}
						<div className="flex flex-row">
							<div className="font-bold text-right font-nunito">
								<p>Contact Number:</p>
								<p>Email Address:</p>
								<p>Complexion:</p>
								<p>Identifying Mark:</p>
							</div>

							<div className="mx-5 text-left">
								<p>{customerInfo.contactNumber}</p>
								<p>{customerInfo.email}</p>
								<p>{customerInfo.complexion}</p>
								<p>{customerInfo.identifyingMark}</p>
							</div>
							{/* Work */}
							<div className="font-bold text-right font-nunito">
								<p>Name of Employer:</p>
								<p>Position:</p>
								<p>Nature of Work:</p>
							</div>

							<div className="mx-5 text-left">
								<p>{customerInfo.employerName}</p>
								<p>{customerInfo.jobPosition}</p>
								<p>{customerInfo.workNature}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
export default CustomerDetails;
