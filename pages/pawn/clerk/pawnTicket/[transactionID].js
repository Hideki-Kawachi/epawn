import { withIronSessionSsr } from "iron-session/next";
import mongoose from "mongoose";
import React, { useEffect, useState } from "react";
import Header from "../../../../components/header";
import ItemCard from "../../../../components/itemcard";
import LoadingSpinner from "../../../../components/loadingSpinner";
import CustomerDetails from "../../../../components/modals/customerDetails";
import NavBar from "../../../../components/navigation/navBar";
import Item from "../../../../schemas/item";
import PriceHistory from "../../../../schemas/priceHistory";
import Transaction from "../../../../schemas/transaction";
import User from "../../../../schemas/user";
import { ironOptions } from "../../../../utilities/config";
import dbConnect from "../../../../utilities/dbConnect";
import Modal from "react-modal";
import dayjs from "dayjs";
import Branch from "../../../../schemas/branch";
import CustomerInfo from "../../../../schemas/customerInfo";
import PawnTicketCard from "../../../../components/pawn/pawnTicketCard";
import AddPawnTicket from "../../../../components/modals/addPawnTicket";
import { useRouter } from "next/router";

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
				status: "Appraised",
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
				let userInfo = await User.findOne({
					userID: transactionInfo.customerID,
				});
				let customerInfo = await CustomerInfo.findOne({
					userID: transactionInfo.customerID,
				});
				let branchInfo = await Branch.findOne({
					branchID: transactionInfo.branchID,
				});
				return {
					props: {
						currentUser: req.session.userData,
						transactionData: JSON.parse(JSON.stringify(transactionInfo)),
						priceHistory: JSON.parse(JSON.stringify(priceHistoryList)),
						itemData: JSON.parse(JSON.stringify(itemList)),
						customerData: JSON.parse(JSON.stringify(customerInfo)),
						userData: JSON.parse(JSON.stringify(userInfo)),
						branchData: JSON.parse(JSON.stringify(branchInfo)),
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

function PawnTicketTransactionID({
	currentUser,
	transactionData,
	priceHistory,
	itemData,
	customerData,
	userData,
	branchData,
}) {
	const [loading, setLoading] = useState(false);
	const [customerModal, setCustomerModal] = useState(false);
	const [loanDate, setLoanDate] = useState(new Date());
	const [maturityDate, setMaturityDate] = useState(new Date());
	const [expiryDate, setExpiryDate] = useState(new Date());
	const [loanAmount, setLoanAmount] = useState(
		priceHistory[0].appraisalPrice.toFixed(2)
	);
	const [advInterest, setAdvInterest] = useState("");
	const [netProceeds, setNetProceeds] = useState("");
	const [pawnTicketList, setPawnTicketList] = useState([]);
	const [pawnTicketModal, setPawnTicketModal] = useState(false);
	const [selectedItems, setSelectedItems] = useState([]);
	const [itemList, setItemList] = useState(itemData);

	const router = useRouter();

	function convertDate(date) {
		if (date == null) return "N/A";
		else {
			const dt = new Date(date);
			return dayjs(dt).format("MM/DD/YYYY");
		}
	}

	useEffect(() => {
		let date = new Date(loanDate);
		setMaturityDate(new Date(date.setDate(date.getDate() + 30)));
		setExpiryDate(new Date(date.setDate(date.getDate() + 30)));
	}, [loanDate]);

	useEffect(() => {
		let tempAdvInterest = loanAmount * 0.035;
		setAdvInterest(tempAdvInterest.toFixed(2));
		setNetProceeds((loanAmount - tempAdvInterest).toFixed(2));
	}, [loanAmount]);

	function addToCheckbox(itemID) {
		if (selectedItems) {
			let doesExist = false;
			selectedItems.forEach((item) => {
				if (item.itemID == itemID) {
					doesExist = true;
				}
			});

			if (!doesExist) {
				let itemSelected = itemList.find((item) => {
					return item.itemID == itemID;
				});
				setSelectedItems((selectedItems) => [...selectedItems, itemSelected]);
			} else {
				let newItemList = [];
				itemList.forEach((item) => {
					if (item.itemID != itemID) {
						newItemList.push(item);
					}
				});
				setSelectedItems(newItemList);
			}
		}
	}

	function openPawnTicketModal() {
		if (selectedItems.length > 0) {
			setPawnTicketModal(true);
		}
	}

	function deletePawnTicket(pawnTicketID) {
		let newPawnTicketList = [];
		let newItemList = [];
		pawnTicketList.forEach((pt) => {
			if (pt.pawnTicketID != pawnTicketID) {
				newPawnTicketList.push(pt);
			} else {
				newItemList = pt.itemList;
			}
		});
		setItemList((itemList) => [...itemList, ...newItemList]);
		setPawnTicketList(newPawnTicketList);
	}

	useEffect(() => {
		// console.log("ASJDKLAJSDKL:", itemList);
		if (pawnTicketList.length > 0) {
			let newItemList = itemList;
			itemList.forEach((item, index) => {
				pawnTicketList.forEach((pt) => {
					pt.itemList.forEach((ptItem) => {
						// console.log("PT ITEM:", ptItem.itemID, "-", item.itemID);
						if (ptItem.itemID == item.itemID) {
							console.log("PUSH");
							newItemList.splice(index, 1);
						}
					});
				});
			});
			setSelectedItems([]);
			setItemList(newItemList);
		}
	}, [pawnTicketList]);

	function submitForm() {
		if (itemList.length == 0) {
			// console.log("pawnticket List:", pawnTicketList);
			setLoading(true);
			fetch("/api/pawn/forApproval", {
				method: "POST",
				body: JSON.stringify({
					pawnTicketList: pawnTicketList,
					transactionData: transactionData,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					// console.log("DATA IS:", data);
					router.replace("/");
				});
		}
	}

	return (
		<>
			<LoadingSpinner isLoading={loading}></LoadingSpinner>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<Modal isOpen={customerModal} ariaHideApp={false} className="modal">
				<CustomerDetails
					trigger={customerModal}
					setTrigger={setCustomerModal}
					customerInfo={customerData}
					userInfo={userData}
				/>
			</Modal>
			<Modal isOpen={pawnTicketModal} ariaHideApp={false} className="modal">
				<AddPawnTicket
					trigger={pawnTicketModal}
					setTrigger={setPawnTicketModal}
					selectedItems={selectedItems}
					pawnTicketList={pawnTicketList}
					setPawnTicketList={setPawnTicketList}
				/>
			</Modal>
			<div id="main-content-area">
				<div className="font-semibold text-center font-dosis">
					<h1 className="text-2xl underline">PAWN</h1>
				</div>

				<div className="flex flex-row justify-start gap-10 p-5 bg-white">
					<div className="flex flex-col ">
						<div className="m-2">
							{/* Customer Details */}
							<p className="font-bold pr-7">
								Customer Details:
								{/* View Customer Details Button */}
								<span
									className="inline-block ml-3 hover:cursor-pointer"
									onClick={() => setCustomerModal(true)}
								>
									<svg
										width="30 "
										height="30"
										viewBox="0 -1 40 30"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M20.5007 7.6875C11.959 7.6875 4.6644 13.0004 1.70898 20.5C4.6644 27.9996 11.959 33.3125 20.5007 33.3125C29.0423 33.3125 36.3369 27.9996 39.2923 20.5C36.3369 13.0004 29.0423 7.6875 20.5007 7.6875ZM20.5007 29.0417C15.7857 29.0417 11.959 25.215 11.959 20.5C11.959 15.785 15.7857 11.9583 20.5007 11.9583C25.2157 11.9583 29.0423 15.785 29.0423 20.5C29.0423 25.215 25.2157 29.0417 20.5007 29.0417ZM20.5007 15.375C17.6648 15.375 15.3757 17.6642 15.3757 20.5C15.3757 23.3358 17.6648 25.625 20.5007 25.625C23.3365 25.625 25.6257 23.3358 25.6257 20.5C25.6257 17.6642 23.3365 15.375 20.5007 15.375Z"
											fill="black"
											className="hover:fill-gray-300"
										/>
									</svg>
								</span>
							</p>
							<div className="flex">
								<div className="ml-5 text-right min-w-fit">
									<p className="">Name:</p>
									<p className="">Contact Number:</p>
									<p className="">Address:</p>
								</div>
								<div className="ml-5 text-left">
									<p className="">
										{userData.firstName} {userData.lastName}
									</p>
									{customerData.contactNumber.length ? (
										<p className="">{customerData.contactNumber}</p>
									) : (
										<br></br>
									)}
									<p className="max-w-md">
										{/* Used to make long address break line */}
										One Archers Residences, Taft Ave, Malate, Metro Manila
									</p>
								</div>
							</div>
						</div>
						<div className="m-2">
							<p className="font-bold pr-7">Pawn Details:</p>
							<div className="flex">
								<div className="ml-5 text-right">
									<p className="">Date Loan Granted:</p>
									<p className="">Maturity Date:</p>
									<p className="">Expiry Date:</p>
									<p className="">Branch:</p>
								</div>
								<div className="ml-5 text-left">
									<p className="">{convertDate(loanDate)}</p>
									<p className="">{convertDate(maturityDate)}</p>
									<p className="">{convertDate(expiryDate)}</p>
									<p className="">{branchData.branchName}</p>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className="m-2">
							<p className="font-bold pr-7">Transaction Details:</p>
							<div className="flex">
								<div className="ml-5 text-right">
									<p className="">Total Loan Amount:</p>
									<p className="">Total Adv. Interest:</p>
									<p className="">Total Net Proceeds:</p>
								</div>
								<div className="ml-5 text-end">
									<p className="w-full">Php {loanAmount}</p>
									<p className="w-full">Php {advInterest}</p>
									<hr></hr>
									<p className="w-full font-bold">Php {netProceeds}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-row gap-10 mt-5">
					<div>
						<h1 className="mb-2 text-base">Item List:</h1>
						<div className="p-5 w-[720px] h-96  overflow-y-scroll bg-white border-2">
							{/* plan: CheckItem & ItemCard section will be generated using .map */}
							{itemList.length > 0 ? (
								<>
									{itemList.map((item) => (
										<div className="flex flex-row" key={item.itemID}>
											<ItemCard key={item.itemID} itemDetails={item}></ItemCard>
											<div className="mt-10">
												<input
													type="checkbox"
													id={item.itemID}
													name="selected"
													value={item.itemID}
													onChange={(e) => addToCheckbox(e.target.value)}
												/>
											</div>
										</div>
									))}
								</>
							) : (
								<div className="mt-32 ">
									<p className="text-sm text-center text-gray-300 font-nunito">
										All items distributed.
									</p>
								</div>
							)}
						</div>
						<div className="flex justify-end w-full p-4 bg-gray-200">
							<button
								className="bg-green-300 "
								onClick={() => openPawnTicketModal()}
							>
								Add to PawnTicket
							</button>
						</div>
					</div>
					<div>
						<h1 className="mb-2 text-base">PawnTickets:</h1>
						<div className="p-5 w-[720px] h-96  overflow-y-scroll bg-white border-2 gap-4 flex flex-col">
							{/* plan: CheckItem & ItemCard section will be generated using .map */}
							{pawnTicketList?.length > 0 ? (
								<>
									{pawnTicketList.map((pt) => (
										<PawnTicketCard
											key={pt.pawnTicketID}
											itemList={pt.itemList}
											pawnTicketID={pt.pawnTicketID}
											deletePawnTicket={deletePawnTicket}
										></PawnTicketCard>
									))}
								</>
							) : (
								<div className="mt-32 ">
									<p className="text-sm text-center text-gray-300 font-nunito">
										No PawnTickets created.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="flex justify-end w-full gap-5 text-base mr-28">
					<button className="px-10 mx-2 my-5 bg-red-300" type="button">
						Cancel
					</button>
					<button
						className="px-10 mx-2 my-5 bg-green-300"
						type="button"
						onClick={() => submitForm()}
						disabled={itemList.length > 0}
					>
						Submit
					</button>
				</div>
			</div>
		</>
	);
}

export default PawnTicketTransactionID;
