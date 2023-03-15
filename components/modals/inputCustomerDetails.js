import Close from "../closebutton";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
function InputCustomerDetails({
	trigger,
	setTrigger,
	customerInfo,
	userInfo,
	transactionID,
}) {
	const [firstName, setFirstName] = useState(
		userInfo.firstName ? userInfo.firstName : ""
	);
	const [middleName, setMiddleName] = useState(
		userInfo.middleName ? userInfo.middleName : ""
	);
	const [lastName, setLastName] = useState(
		userInfo.lastName ? userInfo.lastName : ""
	);
	const [birthDate, setBirthDate] = useState(
		userInfo.birthDate ? userInfo.birthDate : ""
	);
	const [birthPlace, setBirthPlace] = useState(
		userInfo.birthPlace ? userInfo.birthPlace : ""
	);
	const [contactNumber, setContactNumber] = useState(
		customerInfo.contactNumber ? customerInfo.contactNumber : ""
	);
	const [permanentAddress, setPermanentAddress] = useState(
		customerInfo.permanentAddress ? customerInfo.permanentAddress : ""
	);
	const [presentAddress, setPresentAddress] = useState(
		customerInfo.presentAddress ? customerInfo.presentAddress : ""
	);
	const [sex, setSex] = useState(customerInfo.sex ? customerInfo.sex : "");
	const [status, setStatus] = useState(
		customerInfo.status ? customerInfo.status : ""
	);
	const [height, setHeight] = useState(
		customerInfo.height > 0 ? customerInfo.height : 0
	);
	const [weight, setWeight] = useState(
		customerInfo.weight > 0 ? customerInfo.weight : 0
	);
	const [complexion, setComplexion] = useState(
		customerInfo.complexion ? customerInfo.complexion : ""
	);
	const [identifyingMark, setIdentifyingMark] = useState(
		customerInfo.identifyingMark ? customerInfo.identifyingMark : ""
	);
	const [email, setEmail] = useState(
		customerInfo.email ? customerInfo.email : ""
	);
	const [employerName, setEmployerName] = useState(
		customerInfo.employerName ? customerInfo.employerName : ""
	);
	const [jobPosition, setJobPosition] = useState(
		customerInfo.jobPosition ? customerInfo.jobPosition : ""
	);
	const [workNature, setWorkNature] = useState(
		customerInfo.workNature ? customerInfo.workNature : ""
	);
	const [customerInfoSheet, setCustomerInfoSheet] = useState(
		customerInfo.customerInfoSheet ? customerInfo.customerInfoSheet : ""
	);
	const [validID, setValidID] = useState(
		customerInfo.validID ? customerInfo.validID : ""
	);
	const [uriValidID, setUriValidID] = useState("");
	const [uriCustomerInfoSheet, setUriCustomerInfoSheet] = useState("");

	const router = useRouter();

	function closeModal() {
		setTrigger(!trigger);
	}

	async function submitForm() {
		let publicID = "validID-" + userInfo.userID + "-" + new Date();
		let uploadPreset = "signed_preset";
		let type = "authenticated";
		let folder = "epawn/customerImage";
		let signURL = "true";

		console.log("HELLO");

		fetch("/api/signUploadForm", {
			method: "POST",
			body: JSON.stringify({
				public_id: publicID,
				upload_preset: uploadPreset,
				folder: folder,
				type: type,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				const formData1 = new FormData();

				formData1.append("file", validID);
				formData1.append("upload_preset", uploadPreset);
				formData1.append("folder", folder);
				formData1.append("sign_url", signURL);
				formData1.append("type", type);
				formData1.append("api_key", data.apiKey);
				formData1.append("timestamp", data.timestamp);
				formData1.append("signature", data.signature);
				fetch("https://api.cloudinary.com/v1_1/cloudurlhc/image/upload", {
					method: "POST",
					body: formData1,
				})
					.then((res) => res.json())
					.then((data) => {
						console.log("DATA IS:", data);
						setUriValidID(data.secure_url);
					});
			});

		publicID = "customerInfoSheet-" + userInfo.userID + "-" + new Date();

		fetch("/api/signUploadForm", {
			method: "POST",
			body: JSON.stringify({
				public_id: publicID,
				upload_preset: uploadPreset,
				folder: folder,
				type: type,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				const formData2 = new FormData();

				formData2.append("file", customerInfoSheet);
				formData2.append("upload_preset", uploadPreset);
				formData2.append("folder", folder);
				formData2.append("sign_url", signURL);
				formData2.append("type", type);
				formData2.append("api_key", data.apiKey);
				formData2.append("timestamp", data.timestamp);
				formData2.append("signature", data.signature);
				fetch("https://api.cloudinary.com/v1_1/cloudurlhc/image/upload", {
					method: "POST",
					body: formData2,
				})
					.then((res) => res.json())
					.then((data) => {
						console.log("DATA IS:", data);
						setUriCustomerInfoSheet(data.secure_url);
					});
			});
	}

	useEffect(() => {
		if (uriValidID && uriCustomerInfoSheet) {
			let customerData = {
				userID: userInfo.userID,
				birthDate: birthDate,
				birthPlace: birthPlace,
				contactNumber: contactNumber,
				permanentAddress: permanentAddress,
				presentAddress: presentAddress,
				sex: sex,
				status: status,
				height: height,
				weight: weight,
				complexion: complexion,
				identifyingMark: identifyingMark,
				email: email,
				employerName: employerName,
				jobPosition: jobPosition,
				workNature: workNature,
				customerInfoSheet: uriCustomerInfoSheet,
				validID: uriValidID,
			};
			fetch("/api/pawn/newCustomerInfo", {
				method: "POST",
				body: JSON.stringify(customerData),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log("DATA FROM SUBMIT IS:", data);
					router.replace({
						pathname: "pawn/clerk/pawnTicket/[transactionID]",
						query: { transactionID: transactionID },
					});
				});
			console.log("CUSTOMER DATA FROM USE EFFECT IS:", customerData);
		}
	}, [uriValidID, uriCustomerInfoSheet]);

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
					<div className="flex flex-row justify-between p-5 border-2 border-b-0 rounded-t-lg header bg-green-50">
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
								{userInfo.userID}
							</span>
							<p className=" mt-11 mb-[-20px] font-nunito font-bold bg-white w-fit p-2">
								{" "}
								Customer Info{" "}
							</p>
						</div>
						<div className="mt-[69px] font-dosis text-sm flex flex-col items-end w-min gap-2">
							{customerInfo.validID ? (
								<a className="block font-semibold text-right text-green-500 hover:underline hover:text-green-400 hover:cursor-pointer">
									View Valid ID
								</a>
							) : (
								<div className="flex gap-2">
									<span className="font-bold whitespace-nowrap">
										Valid ID:*{" "}
									</span>
									<input
										className="w-56"
										type="file"
										onChange={(e) => setValidID(e.target.files[0])}
									></input>
								</div>
							)}
							{customerInfo.customerInfoSheet ? (
								<a className="block font-semibold text-right text-green-500 hover:underline hover:text-green-400 hover:cursor-pointer">
									View Customer Info Sheet
								</a>
							) : (
								<div className="flex gap-2">
									<span className="font-bold whitespace-nowrap">
										Customer Info Sheet:*{" "}
									</span>
									<input
										className="w-56"
										type="file"
										onChange={(e) => setCustomerInfoSheet(e.target.files[0])}
									></input>
								</div>
							)}
						</div>
					</div>
					{/* Header Row End */}
					<div className="flex-row p-5 bg-white border-2 border-t-0 rounded-b-lg">
						{/* Primary Customer Details */}
						<div className="flex flex-row">
							{/* Name*/}
							<div className="flex flex-col gap-3.5 font-bold text-right font-nunit">
								<p>First Name:*</p>
								<p>Last Name:*</p>
								<p>Middle Name:</p>
							</div>

							<div className="flex flex-col gap-2 mx-2 text-left">
								<input
									value={firstName}
									type="text"
									onChange={(e) => setFirstName(e.target.value)}
								></input>
								<input
									value={lastName}
									type="text"
									onChange={(e) => setLastName(e.target.value)}
								></input>
								<input
									value={middleName}
									type="text"
									onChange={(e) => setMiddleName(e.target.value)}
								></input>
							</div>
							{/* Name*/}
							<div className="flex flex-col gap-3.5 font-bold text-right font-nunit">
								<p>Sex:</p>
								<p>Status:</p>
							</div>

							<div className="flex flex-col gap-2 mx-2 text-left">
								<select value={sex} onChange={(e) => setSex(e.target.value)}>
									<option value={"male"}>Male</option>
									<option value={"female"}>Female</option>
									<option value={"other"}>Other</option>
								</select>
								<input
									value={status}
									type="text"
									onChange={(e) => setStatus(e.target.value)}
								></input>
							</div>
							{/* BMI */}
							<div className="flex flex-col gap-3.5 font-bold text-right font-nunito">
								<p>Height:</p>
								<p>Weight:</p>
							</div>

							<div className="flex flex-col gap-2 mx-2 text-left w-14">
								<input
									value={height}
									type="number"
									onChange={(e) => setHeight(e.target.value)}
								></input>
								<input
									value={weight}
									type="number"
									onChange={(e) => setWeight(e.target.value)}
								></input>
							</div>
						</div>

						<hr className="h-px my-5 bg-gray-300 border-0" />
						{/* Customer Date/Location Details */}
						<div className="flex flex-row">
							{/* Name*/}
							<div className="flex flex-col gap-3.5 font-bold text-right font-nunito">
								<p>Date of Birth:*</p>
								<p>Place of Birth:*</p>
								<p>Present Address:*</p>
								<p>Permanent Address:</p>
							</div>

							<div className="flex flex-col gap-2 mx-2 text-left">
								<input
									value={birthDate}
									type="date"
									onChange={(e) => setBirthDate(e.target.value)}
								></input>
								<input
									value={birthPlace}
									type="text"
									onChange={(e) => setBirthPlace(e.target.value)}
								></input>
								<input
									value={presentAddress}
									type="text"
									onChange={(e) => setPresentAddress(e.target.value)}
								></input>
								<input
									value={permanentAddress}
									type="text"
									onChange={(e) => setPermanentAddress(e.target.value)}
								></input>
							</div>
						</div>

						<hr className="h-px my-5 bg-gray-300 border-0" />

						{/* Other Details */}
						<div className="flex flex-row">
							<div className="flex flex-col gap-3.5 font-bold text-right font-nunito">
								<p>Contact Number:*</p>
								<p>Email Address:</p>
								<p>Complexion:</p>
								<p>Identifying Mark:</p>
							</div>

							<div className="flex flex-col gap-2 mx-2 text-left">
								<input
									value={contactNumber}
									type="tel"
									onChange={(e) => setContactNumber(e.target.value)}
								></input>
								<input
									value={email}
									type="email"
									onChange={(e) => setEmail(e.target.value)}
								></input>
								<input
									value={complexion}
									type="text"
									onChange={(e) => setComplexion(e.target.value)}
								></input>
								<input
									value={identifyingMark}
									type="text"
									onChange={(e) => setIdentifyingMark(e.target.value)}
								></input>
							</div>
							{/* Work */}
							<div className="font-bold text-right font-nunito flex-col flex gap-3.5">
								<p>Name of Employer:</p>
								<p>Position:</p>
								<p>Nature of Work:</p>
							</div>

							<div className="flex flex-col gap-2 mx-2 text-left">
								<input
									value={employerName}
									type="text"
									onChange={(e) => setEmployerName(e.target.value)}
								></input>
								<input
									value={jobPosition}
									type="text"
									onChange={(e) => setJobPosition(e.target.value)}
								></input>
								<input
									value={workNature}
									type="text"
									onChange={(e) => setWorkNature(e.target.value)}
								></input>
							</div>
						</div>
						<div className="flex flex-row justify-end gap-5">
							<button className="bg-red-300" onClick={() => closeModal()}>
								Cancel
							</button>
							<button className="bg-green-300" onClick={() => submitForm()}>
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
export default InputCustomerDetails;
