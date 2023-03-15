import { withIronSessionSsr } from "iron-session/next";
import mongoose from "mongoose";
import React, { useEffect, useState } from "react";
import Header from "../../../../components/header";
import ItemCard from "../../../../components/itemcard";
import LoadingSpinner from "../../../../components/loadingSpinner";
import NavBar from "../../../../components/navigation/navBar";
import Item from "../../../../schemas/item";
import PriceHistory from "../../../../schemas/priceHistory";
import Transaction from "../../../../schemas/transaction";
import User from "../../../../schemas/user";
import { ironOptions } from "../../../../utilities/config";
import dbConnect from "../../../../utilities/dbConnect";
import NewItemCard from "../../../../components/pawn/newTransaction/newItemCard";
import { useRouter } from "next/router";
import InputCustomerDetails from "../../../../components/modals/inputCustomerDetails";
import Modal from "react-modal";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (
			req.session.userData.role == "clerk" &&
			query.transactionID.length == 24
		) {
			await dbConnect();
			let transactionInfo = await Transaction.findOne({
				_id: new mongoose.Types.ObjectId(query.transactionID),
				status: "appraised",
			}).lean();
			if (transactionInfo) {
				let priceHistoryList = await PriceHistory.find({
					transactionID: query.transactionID,
				})
					.sort({ updatedAt: 1 })
					.lean();
				let itemList = await Item.find({
					itemListID: transactionInfo.itemListID,
				}).lean();
				let customerInfo = await User.findOne({
					userID: transactionInfo.customerID,
				});
				return {
					props: {
						currentUser: req.session.userData,
						transactionData: JSON.parse(JSON.stringify(transactionInfo)),
						priceHistory: JSON.parse(JSON.stringify(priceHistoryList)),
						itemData: JSON.parse(JSON.stringify(itemList)),
						customerData: JSON.parse(JSON.stringify(customerInfo)),
					},
				};
			} else {
				return {
					redirect: { destination: "/" },
				};
			}
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

function OngoingTransactionTransactionID({
	currentUser,
	transactionData,
	priceHistory,
	itemData,
	customerData,
}) {
	const [loading, setLoading] = useState(false);
	const [askPrice, setAskPrice] = useState(
		priceHistory[priceHistory.length - 1].askPrice
	);
	const [itemList, setItemList] = useState(itemData);
	const [deleteItems, setDeleteItems] = useState([]);
	const [addItemOpen, setAddItemOpen] = useState(false);
	const [itemIDs, setItemIDs] = useState(-1);
	const [newItemList, setNewItemList] = useState([{}]);
	const [customerInfo, setCustomerInfo] = useState({});
	const [customerInfoShow, setCustomerInfoShow] = useState(false);

	const router = useRouter();

	// console.log("transact data:", transactionData);
	// console.log("price hist:", priceHistory);
	// console.log("item Da:", itemData);
	// console.log("customer Da:", customerData);

	function deleteItem(id) {
		let newList = itemList.filter((items) => {
			return items.itemID != id;
		});
		let deletedItem = itemList.find((items) => items.itemID == id);
		setDeleteItems((deleteItems) => [...deleteItems, deletedItem]);
		setItemList(newList);
	}

	function deleteNewItem(id) {
		let newList = newItemList.filter((items) => {
			return items.id != id;
		});
		setNewItemList(newList);
	}

	function setNewItem(id, name, type, image) {
		let newList = newItemList.map((item) => {
			if (item.id == id) {
				item.name = name;
				item.type = type;
				item.image = image;
			}
			return item;
		});
		setNewItemList(newList);
	}

	useEffect(() => {
		if (JSON.stringify(newItemList[0]) == "{}" && newItemList.length > 1) {
			let tempList = newItemList.splice(1, newItemList.length - 1);
			setNewItemList(tempList);
		}
		// console.log("new item list:", newItemList);
	}, [newItemList]);

	function submitForm() {
		console.log("SUBMIT");
	}

	function renegotiateForm() {
		console.log("RENEGOTIATE");

		let updatedItemList = [];

		setLoading(true);

		// IF ITEM HAS BEEN ADDED
		if (JSON.stringify(newItemList[0]) != "{}" && newItemList.length > 0) {
			newItemList.forEach((item) => {
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

								if (updatedItemList.length == newItemList.length) {
									console.log("UPDATED ITEM:", updatedItemList);

									fetch("/api/pawn/addItem", {
										method: "POST",
										body: JSON.stringify({
											itemData: updatedItemList,
											itemListID: transactionData.itemListID,
										}),
									})
										.then((res) => res.json())
										.then((data) => {
											console.log("END");
											if (data == "success") {
												console.log("success");
											} else {
												console.log("error");
											}
										});
								}
							});
					});
			});
		}

		// IF ITEM HAS BEEN REMOVED
		if (deleteItems.length > 0) {
			fetch("/api/pawn/removeItem", {
				method: "POST",
				body: JSON.stringify(deleteItems),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log("DATA IS:", data);
				});
		}
		// If ask price has been changed
		if (priceHistory[priceHistory.length - 1].askPrice != askPrice) {
			fetch("/api/pawn/newAskPrice", {
				method: "POST",
				body: JSON.stringify({
					transactionID: transactionData._id,
					appraisalPrice: priceHistory[priceHistory.length - 1].appraisalPrice,
					askPrice: parseFloat(askPrice),
				}),
			});
		}

		fetch("/api/pawn/updateTransactionStatus", {
			method: "POST",
			body: JSON.stringify({
				transactionID: transactionData._id,
				status: "for negotiation",
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("DATA IS:", data);
				router.push("/");
			});
	}

	function cancelForm() {
		console.log("CANCEL");
		router.push("/");
	}

	return (
		<>
			<LoadingSpinner isLoading={loading}></LoadingSpinner>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
				<Modal isOpen={customerInfoShow} ariaHideApp={false} className="modal">
					<InputCustomerDetails
						trigger={customerInfoShow}
						setTrigger={setCustomerInfoShow}
						customerInfo={customerInfo}
						userInfo={customerData}
						transactionID={transactionData._id}
					/>
				</Modal>
				<div className="font-semibold text-center font-dosis">
					<h1 className="text-2xl underline">PAWN</h1>
				</div>
				<div className="flex flex-row w-full gap-10">
					<span className="w-full text-base font-bold text-center font-nunito">
						Customer Name:{" "}
						<span className="font-normal">
							{customerData.firstName} {customerData.lastName}
						</span>
					</span>

					<div className="flex flex-col items-center w-full text-base ">
						<span className="flex justify-end w-full pr-[35%] font-normal">
							<span className="mr-2 font-bold">Ask Price: </span>
							Php
							<input
								className="w-40 ml-2 text-end"
								type="number"
								value={askPrice}
								onChange={(e) => setAskPrice(e.target.value)}
							></input>
						</span>
						<span className="flex justify-end w-full font-normal pr-[35%]">
							<span className="mr-2 font-bold">Appraisal Price: </span>
							Php {priceHistory[priceHistory.length - 1].appraisalPrice}
						</span>
					</div>
				</div>
				<div className="flex flex-col w-1/2 gap-2">
					<div>
						<span className="text-base font-bold">Item List: </span>
						<button
							className="bg-green-300"
							type="button"
							onClick={() => {
								setNewItemList([
									...newItemList,
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
					</div>

					<div className="overflow-y-scroll bg-white h-[55vh] flex flex-col">
						{itemList.map((item) => (
							<div key={item.itemID}>
								<div className="w-[95%] mb-[-5%]">
									<ItemCard key={item.itemID} itemDetails={item}></ItemCard>
								</div>
								<div className="relative left-[95%] top-[-6vh] w-min h-min">
									<button
										className="x-button"
										onClick={() => deleteItem(item.itemID)}
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
						{JSON.stringify(newItemList[0]) != "{}" ? (
							newItemList.map((items) => (
								<div key={items.id} className="mb-[-1.5%]">
									<NewItemCard
										id={items.id}
										deleteItem={deleteNewItem}
										setItem={setNewItem}
									></NewItemCard>
								</div>
							))
						) : (
							<></>
						)}
					</div>
				</div>
				<div className="flex justify-end w-1/2 gap-5 text-base">
					<button
						className="px-10 mx-2 my-5 bg-red-300"
						type="button"
						onClick={() => cancelForm()}
					>
						Cancel
					</button>
					<button
						className="px-10 mx-2 my-5 bg-blue-300"
						type="button"
						onClick={() => renegotiateForm()}
					>
						Renegotiate
					</button>
					<button
						className="px-10 mx-2 my-5 bg-green-300"
						type="button"
						onClick={() => setCustomerInfoShow(true)}
					>
						Proceed
					</button>
				</div>
			</div>
		</>
	);
}

export default OngoingTransactionTransactionID;
