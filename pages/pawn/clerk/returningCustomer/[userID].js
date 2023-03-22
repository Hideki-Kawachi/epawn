import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../../../components/header";
import NavBar from "../../../../components/navigation/navBar";
import NewItemList from "../../../../components/pawn/newTransaction/newItemList";
import Modal from "react-modal";
import Cancel from "../../../../components/modals/cancel";
import AskPrice from "../../../../components/modals/askPrice";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../../utilities/config";
import LoadingSpinner from "../../../../components/loadingSpinner";
import User from "../../../../schemas/user";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (
			req.session.userData.role == "clerk" &&
			query.userID.length == 7
		) {
			let userInfo = await User.findOne({ userID: query.userID }).lean();
			return {
				props: {
					currentUser: req.session.userData,
					userData: JSON.parse(JSON.stringify(userInfo)),
				},
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

function ReturningCustomerUserID({ currentUser, userData }) {
	// MODALS
	const [submitOpen, setSubmitOpen] = useState(false); //Submit
	const [cancelOpen, setCancelOpen] = useState(false); //Cancel

	const [askPrice, setAskPrice] = useState(0);
	const [askPriceShow, setAskPriceShow] = useState("0");
	const [itemIDs, setItemIDs] = useState(0);
	const [itemList, setItemList] = useState([
		{ id: itemIDs, name: "", type: "", image: "" },
	]);
	const [error, setError] = useState(false);
	const [sendForm, setSendForm] = useState(false);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	function isDigit(value) {
		return /^-?\d+$/.test(value);
	}

	function convertPrice(value) {
		let newString = "";

		if (isDigit(value.charAt(value.length - 1))) {
			if (value.includes(",")) {
				let subValues = value.split(",");

				subValues.forEach((subValue) => {
					newString += subValue;
				});
			} else {
				newString = value;
			}
			setAskPrice(parseInt(newString));
			setAskPriceShow(parseInt(newString).toLocaleString("en-US"));
		} else if (askPrice < 9) {
			setAskPrice(0);
			setAskPriceShow("0");
		}
	}

	function checkForm() {
		let errorTemp = false;

		if (itemList.length == 0) {
			errorTemp = true;
		} else {
			itemList.forEach((item) => {
				if (item.name.length == 0 || !item.image) {
					errorTemp = true;
				}
			});
		}

		if (askPrice == 0 || errorTemp) {
			setError(true);
		} else {
			setSubmitOpen(true);
		}
	}

	function cancelContentShow() {
		return (
			<>
				Are you sure you want to cancel the <b>Pawn</b>?
				<br />
				<br />
				All unsubmitted data will be lost.
			</>
		);
	}

	useEffect(() => {
		if (sendForm) {
			let updatedItemList = [];

			setLoading(true);
			itemList.forEach((item) => {
				let publicID = item.name + "-" + new Date();
				let folder = "epawn/itemImage";
				let uploadPreset = "signed_preset";
				let type = "authenticated";
				let signURL = "true";

				console.log("HELLO");

				fetch("/api/signUploadForm", {
					method: "POST",
					body: JSON.stringify({
						public_id: publicID,
						upload_preset: uploadPreset,
						folder: folder,
						type: type,
						//sign_url: signURL,
					}),
				})
					.then((res) => res.json())
					.then((data) => {
						const formData = new FormData();

						formData.append("file", item.image);
						formData.append("upload_preset", uploadPreset);
						formData.append("folder", folder);
						formData.append("sign_url", signURL);
						formData.append("type", type);
						formData.append("api_key", data.apiKey);
						formData.append("timestamp", data.timestamp);
						formData.append("signature", data.signature);

						fetch("https://api.cloudinary.com/v1_1/cloudurlhc/image/upload", {
							method: "POST",
							body: formData,
						})
							.then((res) => res.json())
							.then((data) => {
								console.log("DATA IS:", data);
								updatedItemList.push({
									id: item.id,
									image: data.secure_url,
									name: item.name,
									type: item.type,
								});

								if (updatedItemList.length == itemList.length) {
									console.log("UPDATED ITEM:", updatedItemList);

									let transac = {
										userID: userData.userID,
										askPrice: askPrice,
										itemList: updatedItemList,
										clerkID: currentUser.userID,
										branchID: currentUser.branchID,
									};

									fetch("/api/pawn/returningCustomerPawn", {
										method: "POST",
										body: JSON.stringify(transac),
									})
										.then((res) => res.json())
										.then((data) => {
											console.log("END");
											if (data == "success") {
												router.replace("/");
											} else {
												console.log("error");
												//router.reload();
											}
										});
								}
							});
					});
			});
			setSendForm(false);
		}
	}, [sendForm]);

	return (
		<>
			<LoadingSpinner isLoading={loading}></LoadingSpinner>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<Modal isOpen={cancelOpen} ariaHideApp={false} className="modal">
				<Cancel
					trigger={cancelOpen}
					setTrigger={setCancelOpen}
					content={cancelContentShow()}
				/>
			</Modal>
			<Modal isOpen={submitOpen} ariaHideApp={false} className="modal">
				<AskPrice
					firstName={userData.firstName}
					lastName={userData.lastName}
					askPrice={askPrice}
					setSubmitOpen={setSubmitOpen}
					setSendForm={setSendForm}
				></AskPrice>
			</Modal>
			<div id="main-content-area">
				<div className="font-semibold text-center font-dosis">
					<h1 className="text-2xl underline">PAWN</h1>
					<span className="text-lg">Returning Customer</span>
				</div>
				<form className="flex gap-40 mt-[5vh] text-base font-nunito">
					<div className="flex flex-row gap-5 w-[30vw] justify-end">
						<div className="flex flex-col gap-5 font-bold text-end">
							<span>First Name:</span>
							<span>Middle Name:</span>
							<span>Last Name: </span>
						</div>
						<div className="flex flex-col gap-5">
							<span>{userData.firstName}</span>
							{userData.middleName ? (
								<span>{userData.middleName}</span>
							) : (
								<br></br>
							)}
							<span>{userData.lastName}</span>
						</div>
					</div>
					<div className="w-[40vw] flex flex-col gap-5">
						<label htmlFor="askName">
							Ask Price:
							<span className="ml-4 font-semibold">Php</span>
							<input
								type="text"
								id="askPrice"
								className="ml-2"
								required
								value={askPriceShow}
								onChange={(e) => convertPrice(e.target.value)}
							></input>
						</label>
						<span>
							Item List:
							<button
								className="ml-6 font-semibold text-white bg-green-300"
								type="button"
								onClick={() => {
									setItemList([
										...itemList,
										{
											id: itemIDs + 1,
											name: "",
											type: "",
											image: "",
										},
									]);
									setItemIDs(itemIDs + 1);
								}}
							>
								Add Item
							</button>
						</span>
						<NewItemList
							itemList={itemList}
							setItemList={setItemList}
						></NewItemList>
						<div className="flex justify-end gap-5">
							<button
								className="px-10 mx-2 my-5 bg-red-300"
								type="button"
								onClick={() => setCancelOpen(true)}
							>
								Cancel
							</button>
							<button
								className="px-10 mx-2 my-5 bg-green-300"
								type="button"
								onClick={() => checkForm()}
							>
								Submit
							</button>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}

export default ReturningCustomerUserID;
