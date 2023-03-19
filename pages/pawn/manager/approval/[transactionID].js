import React, { useEffect, useState } from "react";
import Header from "../../../../components/header";
import NavBar from "../../../../components/navigation/navBar";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../../utilities/config";
import dbConnect from "../../../../utilities/dbConnect";
import Transaction from "../../../../schemas/transaction";
import Item from "../../../../schemas/item";
import User from "../../../../schemas/user";
import mongoose from "mongoose";
import PawnTicket from "../../../../schemas/pawnTicket";
import Modal from "react-modal";
import CustomerDetails from "../../../../components/modals/customerDetails";
import CustomerInfo from "../../../../schemas/customerInfo";
import dayjs from "dayjs";
import Branch from "../../../../schemas/branch";
import PawnTicketCard from "../../../../components/pawn/pawnTicketCard";
import LoadingSpinner from "../../../../components/loadingSpinner";
import printPawnTicket from "../../../../utilities/printPawnTicket";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (
			req.session.userData.role == "manager" &&
			query.transactionID.length == 24
		) {
			await dbConnect();
			let transactionInfo = await Transaction.findOne({
				_id: new mongoose.Types.ObjectId(query.transactionID),
				status: "for approval",
			}).lean();
			if (transactionInfo) {
				let pawnTicketList = await PawnTicket.find({
					transactionID: query.transactionID,
				}).lean();

				let loanAmount = 0;
				let itemListIDs = [];
				pawnTicketList.forEach((pt) => {
					itemListIDs.push(pt.itemListID);
					loanAmount += pt.loanAmount;
				});

				let itemList = [];

				for (let itemListID of itemListIDs) {
					let tempList = await Item.find({
						itemListID: itemListID,
					}).lean();
					itemList = itemList.concat(tempList);
				}

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
						itemData: JSON.parse(JSON.stringify(itemList)),
						customerData: JSON.parse(JSON.stringify(customerInfo)),
						pawnTicketData: JSON.parse(JSON.stringify(pawnTicketList)),
						userData: JSON.parse(JSON.stringify(userInfo)),
						branchData: JSON.parse(JSON.stringify(branchInfo)),
						loanAmount: loanAmount,
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

function ApprovalTransactionID({
	currentUser,
	transactionData,
	itemData,
	customerData,
	pawnTicketData,
	userData,
	branchData,
	loanAmount,
}) {
	// console.log("pawnticket details:", pawnTicketData);
	// console.log("customer details:", customerData);
	// console.log("item details:", itemData);
	// console.log("transaction details:", transactionData);

	const [customerModal, setCustomerModal] = useState(false);
	const [pawnTicketList, setPawnTicketList] = useState([]);
	const [loading, setLoading] = useState(false);
	const advInterest = parseFloat(loanAmount) * 0.035;
	const netProceeds = parseFloat(loanAmount) - advInterest;

	function convertDate(date) {
		if (date == null) return "N/A";
		else {
			const dt = new Date(date);
			return dayjs(dt).format("MM/DD/YYYY");
		}
	}

	useEffect(() => {
		let tempPawnTicketList = [];
		pawnTicketData.forEach((pt) => {
			let tempItemList = [];
			itemData.forEach((item) => {
				if (pt.itemListID == item.itemListID) {
					tempItemList.push(item);
				}
			});
			tempPawnTicketList.push({ ptID: pt._id, itemList: tempItemList });
		});
		setPawnTicketList(tempPawnTicketList);
	}, []);

	function submitForm() {
		setLoading(true);
		fetch("/api/pawn/approvePawn", {
			method: "POST",
			body: JSON.stringify({
				pawnTicketList: pawnTicketList,
				transactionData: transactionData,
				branchID: branchData.branchID,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				printPawnTicket(data);
				setLoading(false);
				console.log("PRINTING");
			});
	}

	function cancelForm() {
		console.log("cancel");
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
									<p className="">{convertDate(pawnTicketData[0].loanDate)}</p>
									<p className="">
										{convertDate(pawnTicketData[0].maturityDate)}
									</p>
									<p className="">
										{convertDate(pawnTicketData[0].expiryDate)}
									</p>
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
									<p className="w-full">Php {loanAmount.toFixed(2)}</p>
									<p className="w-full">Php {advInterest.toFixed(2)}</p>
									<hr></hr>
									<p className="w-full font-bold">
										Php {netProceeds.toFixed(2)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-row gap-10 mt-5">
					<div>
						<h1 className="mb-2 text-base">PawnTickets:</h1>
						<div className="p-5 w-[720px] h-96  overflow-y-scroll bg-white border-2 gap-4 flex flex-col">
							{/* plan: CheckItem & ItemCard section will be generated using .map */}
							{pawnTicketList.length > 0 ? (
								pawnTicketList.map((pt, index) => (
									<PawnTicketCard
										key={pt.ptID}
										itemList={pt.itemList}
										pawnTicketID={index + 1}
										deletePawnTicket
									></PawnTicketCard>
								))
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
				<div className="flex justify-end w-full gap-5 text-base mr-28">
					<button
						className="px-10 mx-2 my-5 bg-red-300"
						type="button"
						onClick={() => cancelForm()}
					>
						Cancel
					</button>
					<button
						className="px-10 mx-2 my-5 bg-green-300"
						type="button"
						onClick={() => submitForm()}
					>
						Submit
					</button>
				</div>
			</div>
		</>
	);
}

export default ApprovalTransactionID;
