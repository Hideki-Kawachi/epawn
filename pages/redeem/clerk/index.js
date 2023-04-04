import React, { useState, useEffect } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import DetailsCardClerk from "../../../components/redeem/detailsClerk";
import Modal from "react-modal";
import Submit from "../../../components/modals/submitRedeem";
import Cancel from "../../../components/modals/cancel";
import PawnDetails from "../../../components/modals/pawnDetails";
import ItemMockData from "./ITEMS_MOCK_DATA";
import ItemCard from "../../../components/itemcard";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";
import dbConnect from "../../../utilities/dbConnect";
import Delete from "../../../components/modals/delWarning";
import { useRouter } from "next/router";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "clerk") {
			await dbConnect();

			return {
				props: { currentUser: req.session.userData },
			};
		} else if (req.session.userData.role == "customer") {
			return {
				redirect: { destination: "/customer", permanent: true },
				props: {},
			};
		} else {
			return {
				redirect: { destination: "/" },
			};
		}
	},
	ironOptions
);

function RedeemClerk({ currentUser }) {
	// Modals
	const [submitModal, setSubmitOpen] = useState(false); //Submit
	const [cancelModal, setCancelOpen] = useState(false); //Cancel
	const [mode, setMode] = useState(true); //how the layout behaves, true if no PT, select if PT is false
	const [deleteModal, setDeleteModal] = useState(false);

	//Item List Array
	const [itemList, setitemList] = useState([]);
	const router = useRouter();

	//Pawn Ticket Details
	const [PTNumber, setPTNumber] = useState(""); //test A-123456
	const [userInfo, setUserInfo] = useState([]);
	const [ptInfo, setPTinfo] = useState([]);
	const [branch, setBranch] = useState("N/A");
	const [customerID, setCustomerID] = useState("N/A");
	const [customerDetails, setCusDetails] = useState(["N/A"]);
	const [amountToPay, setAmountToPay] = useState();
	const [partialPayment, setPartialPayment] = useState(0);
	const [isOriginal, setOriginal] = useState("original");
	const [pawnHistory, setPawnHistory] = useState();
	//Array for Redeem
	const [redeem, setRedeem] = useState([]);
	const [redeemArray, setRedeemArray] = useState([]);
	const [deleteIndex, setDeleteIndex] = useState(0);
	const [deleteItem, setDeleteItem] = useState([]);
	const [checkedBoxes, setCheckedBoxes] = useState([]);
	const [forSubmit, setSubmit] = useState([]);

	//Item List Backend States
	const [itemListID, setItemListID] = useState("");
	const [transactionID, setTransactionID] = useState("");
	const [sendForm, setSendForm] = useState(false);
	const [button, setButton] = useState(true); //disabled if PT number is invalid

	//Authorized Rep States
	const [redeemedBy, setRedeemedBy] = useState("");
	const [authRep, setAuthRep] = useState([{ fName: "", mName: "", lName: "" }]);

	const [authRepID, setAuthRepID] = useState();
	const [authProof, setAuthProof] = useState();

	const [authStatus, setAuthStatus] = useState(false); //true - valid inputs, false - invalid inputs or redeemed by original customer
	const [urlValidID, setUrlValidID] = useState("");
	const [urlAuthorization, setUrlAuthorziation] = useState("");
	//manage modals
	function submitOpen() {
		setSubmitOpen(true);
	}

	function cancelForm() {
		setCancelOpen(true);
	}

	function searchPawnTicket(ptnumber) {
		setPTNumber(ptnumber);
	}

	function removeModal(item, index) {
		setDeleteItem(item);
		setDeleteIndex(index);
		setDeleteModal(true);
	}

	function putamountToPay(amount) {
		setAmountToPay(amount);
	}
	function getTotalRedeem(redeemList) {
		var total = 0;

		redeemList.forEach((item) => {
			total += Number(item.price);
		});
		return total;
	}

	//Manages Add to Redeem Cart
	function removeItem() {
		let tempRedeemArray = redeemArray.filter((item, index) => {
			return index != deleteIndex;
		});
		itemList.splice(0, 0, deleteItem);
		// console.log("remove item", tempRedeemArray);
		setRedeemArray(tempRedeemArray);
	}

	const handleCheckboxChange = (event, itemDetails) => {
		const checked = event.target.checked;
		const newCheckedBoxes = [...checkedBoxes];

		if (checked) {
			newCheckedBoxes.push(itemDetails);
		} else {
			const itemIndex = newCheckedBoxes.findIndex(
				(item) => item.itemID === itemDetails.itemID
			);
			if (itemIndex >= 0) {
				newCheckedBoxes.splice(itemIndex, 1);
			}
		}
		setCheckedBoxes(newCheckedBoxes);
	};

	function addToRedeem() {
		if (checkedBoxes.length > 0) {
			if (redeemArray.length > 0) {
				setRedeem(redeem.concat(checkedBoxes));
			} else setRedeem(checkedBoxes);
		}

		checkedBoxes.forEach((check) => {
			const redeemedIndex = itemList.findIndex(
				(item) => item.itemID === check.itemID
			);
			if (redeemedIndex >= 0) {
				itemList.splice(redeemedIndex, 1);
			}
		});
		setCheckedBoxes([]);
	}

	useEffect(() => {
		setRedeemArray(redeem);
	}, [redeem]);

	function changeMode() {
		setMode(!mode);
		// console.log("Mode changed to " + mode);
	}
	//manage cancel modal
	function cancelContentShow() {
		return (
			<>
				Are you sure you want to cancel the <b> redemption </b> transaction?
				<br />
				All unsubmitted data will be lost.
			</>
		);
	}
	// BACKEND TO RETRIEVE PAWN TICKET
	useEffect(() => {
		if (PTNumber != "") {
			fetch("/api/" + PTNumber, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((data) => {
					// console.log(data)
					if (data != null) {
						setCustomerID(data.customerID);
						setTransactionID(data.transactionID);
						setPTinfo(data);
						setItemListID(data.itemListID);
						if (data.isInactive || new Date(data.expiryDate) < new Date()) {
							setButton(true);
						} else {
							setButton(false);
						}

						fetch("/api/redeem/partialPayment/" + data.itemListID, {
							method: "GET",
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
							},
						})
							.then((res) => res.json())
							.then((oldpt) => {
								// console.log("Old PT is: " + JSON.stringify(oldpt));
								if (oldpt != null) {
									setPartialPayment(Number(oldpt.loanAmount - data.loanAmount));
									// console.log("Partial Payment is now: " + partialPayment);
								} else setPartialPayment(0);
							});
					} else {
						setPTinfo("N/A");
						setTransactionID("N/A");
						setUserInfo("N/A");
						setCusDetails("N/A");
						setCustomerID("N/A");
						setItemListID("N/A");
						setitemList([]);
						setButton(true);
					}
				});
		}
	}, [PTNumber]);

	// BACKEND TO RETRIEVE ItemListID using TransactionID
	useEffect(() => {
		if (transactionID != "N/A") {
			fetch("/api/redeem/" + transactionID, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((transaction) => {
					// console.log(data)
					if (transaction != null) {
						setBranch(transaction.branchID);
					} else {
						setItemListID("N/A");
						setBranch("N/A");
					}
				});
		}
	}, [transactionID]);

	// BACKEND TO RETRIEVE ItemListID using TransactionID
	useEffect(() => {
		if (itemListID != "N/A") {
			fetch("/api/redeem/itemList/" + itemListID, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((info) => {
					// console.log(data)
					if (info != null) {
						// console.log(JSON.stringify(info))
						let list = JSON.stringify(info);
						setitemList(JSON.parse(list)); //temporary
						setSubmit(JSON.parse(list));
					} else {
						// setitemList(JSON.parse(data));
					}
				});
				fetch("/api/clerkPawnHistory/" + itemListID, {
					method: "GET",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				})
					.then((res) => res.json())
					.then((history) => {
						if(history != "error"){
							console.log("Pawn history found: " + history)
							setPawnHistory(history)
						}
						else{
						setPawnHistory([])
						console.log("Pawn history NOT found")
						}
					})
		}
	}, [itemListID]);

	// BACKEND TO RETRIEVE CUSTOMER NAME USING USER ID
	useEffect(() => {
		if (customerID != "N/A") {
			fetch("/api/users/" + customerID, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((user) => {
					console.log("result from fetch user:", user);
					if (user != null) {
						// console.log(JSON.stringify(info))
						setUserInfo(user);
					}
				});

			// BACKEND TO RETRIEVE CUSTOMER DETAILS WITH USERID
			fetch("/api/users/customers/" + customerID, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((customer) => {
					console.log("result from fetch customer:", customer);
					if (customer != null) {
						setCusDetails(customer);
					}
				});
		}
	}, [customerID]);

	// useEffect(() => {
	// 	if (customerID != "N/A") {
	// 		fetch("/api/users/customers/" + customerID, {
	// 			method: "GET",
	// 			headers: {
	// 				Accept: "application/json",
	// 				"Content-Type": "application/json",
	// 			},
	// 		})
	// 			.then((res) => res.json())
	// 			.then((customer) => {
	// 				// console.log(data)
	// 				if (customer != null) {
	// 					setCusDetails(JSON.parse(JSON.stringify(customer)));
	// 				}
	// 			});
	// 	}
	// }, [customerID]);

	// useEffect(() => {
	// 	console.log("Here: " + itemListID);
	// 	if(itemListID != ""){
	// 		fetch("/api/redeem/partialPayment/" + itemListID, {
	//           method: "GET",
	//           headers: {
	//             Accept: "application/json",
	//             "Content-Type": "application/json",
	//           },
	//         })
	//           .then((res) => res.json())
	//           .then((oldpt) => {
	//              console.log("Old PT is: " + JSON.stringify(oldpt));
	//             if (oldpt != null) {
	//               setPartialPayment(Number(oldpt.loanAmount - ptInfo.loanAmount));
	// 			  console.log("Partial Payment is now: " + partialPayment)
	//             }
	// 			else
	// 			setPartialPayment(0);
	//           });
	// 	}
	// }, [itemListID, partialPayment, ptInfo])

	// useEffect to change items to be displayed in Select or Submit Modal
	useEffect(() => {
		if (mode) {
			setSubmit(itemList);
		} else setSubmit(redeemArray);
	}, [mode, itemList, redeemArray]);

	//useEffect to submit the Redemption Transaction

	function submitForm() {
		if (authStatus) {
			//Adding new entries to User and RepresentativeInfo Schemas
			//User -> role, fName, lName, mName, password, isDisabled=false
			//RepresentativeInfo -> proof authorization, validID
			console.log("YOU ARE CREATING AUTH REP");
			let publicID = "validID" + "-" + customerID + "-" + new Date();
			let folder = "epawn/customerImage";
			let uploadPreset = "signed_preset";
			let type = "authenticated";
			let signURL = "true";

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

					formData1.append("file", authRepID);
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
							// console.log("DATA IS " + data);
							setUrlValidID(data.secure_url);
						});
				});

			let publicID2 = "AuthRep" + "-" + customerID + "-" + new Date();
			fetch("/api/signUploadForm", {
				method: "POST",
				body: JSON.stringify({
					public_id: publicID2,
					upload_preset: uploadPreset,
					folder: folder,
					type: type,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					const formData2 = new FormData();

					formData2.append("file", authProof);
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
							// console.log("AuthRep pics Posted data is" + data);
							setUrlAuthorziation(data.secure_url);
						});
				});
			// let transac = {
			//   redeemArray : redeemArray,
			// }
		}
		setSendForm(true);
		//Adding new entry to Transaction
	}

	useEffect(() => {
		if (sendForm) {
			if (isOriginal == "authorized") {
				if (urlValidID && urlAuthorization) {
					if (authStatus) {
						let newrep = {
							firstName: authRep[0].fName,
							middleName: authRep[0].mName,
							lastName: authRep[0].lName,
							authorization: urlAuthorization,
							validID: urlValidID,
						};
						//	console.log(newrep);
						fetch("/api/redeem/newRepresentative", {
							method: "POST",
							body: JSON.stringify(newrep),
						})
							.then((res) => res.json())
							.then((data) => {
								// console.log("END");
								if (data != "RepInfo not added" && data != null) {
									// console.log("new rep created!");
									setRedeemedBy(data);
								} else {
									console.log("error");
								}
							});
					}
				}
			} else {
				setRedeemedBy(customerID);
			}
		}
	}, [sendForm, urlValidID, urlAuthorization]);

	useEffect(() => {
		if (redeemedBy) {
			let transac = {
				customerID: redeemedBy,
				itemListID: itemListID,
				redeemArray: redeemArray,
				clerkID: currentUser.userID,
				pawnTicketID: PTNumber,
				branchID: currentUser.branchID,
				totalAmount: parseFloat(amountToPay.toFixed(2)),
			};
			// console.log("transac is" + JSON.stringify(transac))
			fetch("/api/redeem/newClerkRedeem", {
				method: "POST",
				body: JSON.stringify(transac),
			})
				.then((res) => res.json())
				.then((data) => {
					// console.log("END");
					if (data == "redeem posted successfully") {
						router.replace("/");
					} else {
						console.log("error");
					}
				});
		}
	}, [redeemedBy]);

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			{/* First Half */}

			<Modal isOpen={submitModal} ariaHideApp={false} className="modal">
				<Submit
					trigger={submitModal}
					setTrigger={setSubmitOpen}
					mode={mode}
					changeMode={changeMode}
					PTnumber={PTNumber}
					itemList={forSubmit}
					setSendForm={setSendForm}
					sendForm={sendForm}
					submitForm={submitForm}
				/>
			</Modal>

			<Modal isOpen={deleteModal} ariaHideApp={false} className="modal">
				<Delete
					trigger={deleteModal}
					setTrigger={setDeleteModal}
					content={deleteItem.itemName + " (" + deleteItem.itemID + ") "}
					trigger2={removeItem}
				/>
			</Modal>

			<Modal isOpen={cancelModal} ariaHideApp={false} className="modal">
				<Cancel
					trigger={cancelModal}
					setTrigger={setCancelOpen}
					content={cancelContentShow()}
				/>
			</Modal>

			<div id="main-content-area" className="flex-col">
				<p className="mb-5 text-xl font-semibold text-green-500 underline font-dosis">
					Redeem
				</p>
				<div className="flex">
					<DetailsCardClerk
						redeem={redeemArray}
						branch={branch}
						pawnTicket={ptInfo}
						user={userInfo}
						PTNumber={PTNumber}
						search={searchPawnTicket}
						mode={mode}
						customer={customerDetails}
						authRep={authRep}
						setAuthRep={setAuthRep}
						authRepID={authRepID}
						setAuthRepID={setAuthRepID}
						authStatus={authStatus}
						setAuthStatus={setAuthStatus}
						authProof={authProof}
						setAuthProof={setAuthProof}
						getAmount={setAmountToPay}
						partialPayment={partialPayment}
						isOriginal={isOriginal}
						setOriginal={setOriginal}
						pawnHistory={pawnHistory}
					/>
				</div>

				{/* Second Half */}

				{/* Remaining Items  */}

				{/* plan: CheckItem is ItemCard w/ Check*/}
				{mode == true ? (
					<div className="flex">
						<div className="mt-20">
							<p className="ml-10 text-sm font-bold font-nunito">
								Pawned Items:{" "}
							</p>
							<div className="p-5 mx-10 w-[720px] h-96  overflow-y-scroll bg-white border-2">
								{/* plan: CheckItem & ItemCard section will be generated using .map */}

								{/* When PT isn't selected yet*/}
								{itemList.length > 0 ? (
									<>
										{itemList.map((item) => (
											<div className="flex flex-row" key={item.itemID}>
												<ItemCard
													key={item.itemID}
													itemDetails={item}
												></ItemCard>
											</div>
										))}
									</>
								) : (
									<div className="mt-32 ">
										<p className="text-xl font-bold text-center text-gray-300 font-nunito">
											{" "}
											No items displayed.
										</p>
										<p className="text-sm text-center text-gray-300 font-nunito">
											{" "}
											Search for a Pawn Ticket to display its details and items.
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				) : (
					<div className="flex">
						{/* Remaining Items  */}

						<div className="mt-20">
							<p className="ml-10 text-base font-bold font-nunito">
								Remaining Items:{" "}
							</p>
							{/* plan: CheckItem is ItemCard w/ Check*/}
							<div className="p-5 mx-10 w-[720px] h-96  overflow-y-scroll bg-white border-2">
								{/* plan: CheckItem & ItemCard section will be generated using .map */}
								{itemList.length > 0 ? (
									<>
										{itemList.map((item) => (
											<div className="flex flex-row" key={item.itemID}>
												<ItemCard
													key={item.itemID}
													itemDetails={item}
												></ItemCard>
												<div className="mt-10">
													<input
														type="checkbox"
														id={item.itemID}
														name="selected"
														value={item.itemID}
														onChange={(e) => handleCheckboxChange(e, item)}
													/>
												</div>
											</div>
										))}
									</>
								) : (
									<div className="mt-32 ">
										<p className="text-xl font-bold text-center text-gray-300 font-nunito">
											No items displayed.
										</p>
										<p className="text-sm text-center text-gray-300 font-nunito">
											All items will be redeemed.
										</p>
									</div>
								)}
							</div>
							<div className="mx-10 bg-gray-200 rounded-b-xl">
								<div className="py-3">
									<section className="ml-80">
										<span className="ml-20 mr-10 font-bold font-nunito">
											Selected ({checkedBoxes.length}){" "}
										</span>
										<button
											className="text-white bg-green-300"
											onClick={addToRedeem}
										>
											Add to Redeem
										</button>
									</section>
								</div>
							</div>
						</div>

						{/*Items for Redemption */}
						<div className="mt-20 ">
							<p className="ml-10 text-base font-bold font-nunito">
								Items for Redemption:{" "}
							</p>
							<div
								className="bg-white p-5 mx-10 w-[720px] h-[450px] overflow-y-scroll border-2"
								key="0"
							>
								{redeemArray.length == 0 ? (
									<div className=" mt-44">
										<p className="text-xl font-bold text-center text-gray-300 font-nunito">
											{" "}
											No items selected.
										</p>
										<p className="text-sm text-center text-gray-300 font-nunito">
											{" "}
											Select the items and click <i>Add to Redeem</i> to add the
											items for redemption.
										</p>
									</div>
								) : (
									<>
										{redeemArray.map((items, index) => (
											<div className="flex flex-row" key={index}>
												<ItemCard
													key={items.itemID}
													itemDetails={items}
												></ItemCard>
												<div className="mt-10">
													<button
														className="x-button"
														onClick={() => removeModal(items, index)}
													>
														<svg
															width="20"
															height="20"
															viewBox="0 0 14 14"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																d="M9.16711 6.29289C8.77658 6.68342 8.77658 7.31658 9.16711 7.70711L13.7071 12.2471C13.8946 12.4346 14 12.689 14 12.9542V13C14 13.5523 13.5523 14 13 14H12.9542C12.689 14 12.4346 13.8946 12.2471 13.7071L7.70711 9.16711C7.31658 8.77658 6.68342 8.77658 6.29289 9.16711L1.75289 13.7071C1.56536 13.8946 1.311 14 1.04579 14H1C0.447716 14 0 13.5523 0 13V12.9542C0 12.689 0.105357 12.4346 0.292893 12.2471L4.83289 7.70711C5.22342 7.31658 5.22342 6.68342 4.83289 6.29289L0.292893 1.75289C0.105357 1.56536 0 1.311 0 1.04579V1C0 0.447716 0.447716 0 1 0H1.04579C1.311 0 1.56536 0.105357 1.75289 0.292893L6.29289 4.83289C6.68342 5.22342 7.31658 5.22342 7.70711 4.83289L12.2471 0.292893C12.4346 0.105357 12.689 0 12.9542 0H13C13.5523 0 14 0.447716 14 1V1.04579C14 1.311 13.8946 1.56536 13.7071 1.75289L9.16711 6.29289Z"
																fill="red"
															/>
														</svg>
													</button>
												</div>
											</div>
										))}
									</>
								)}
							</div>
						</div>
						{/* amount to pay: {amountToPay} */}
					</div>
				)}

				<div className="mt-5 flex flex-row ml-[1180px] md:ml-[800px]">
					<div>
						<button
							className="px-10 mx-2 my-5 text-sm text-white bg-red-300"
							onClick={cancelForm}
						>
							Cancel
						</button>
					</div>
					<div>
						{mode == true ? (
							<button
								className="px-10 mx-2 my-5 text-sm text-white bg-green-300 disabled:bg-gray-500 disabled:text-gray-500 "
								onClick={submitOpen}
								disabled={button}
							>
								Select
							</button>
						) : (
							<>
								{redeemArray.length == 0 || !authStatus ? (
									<button
										className="px-10 mx-2 my-5 text-sm text-white bg-green-300 disabled:bg-gray-500 disabled:text-gray-500 "
										onClick={submitOpen}
										disabled
									>
										Submit
									</button>
								) : (
									<button
										className="px-10 mx-2 my-5 text-sm text-white bg-green-300 disabled:bg-gray-500 disabled:text-gray-500 "
										onClick={submitOpen}
									>
										Submit
									</button>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default RedeemClerk;
