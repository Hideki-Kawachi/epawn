import dayjs from "dayjs";
import { withIronSessionSsr } from "iron-session/next";
import mongoose from "mongoose";
import React, { useState } from "react";
import Modal from "react-modal";
import Header from "../../components/header";
import CustomerDetails from "../../components/modals/customerDetails";
import NavBar from "../../components/navigation/navBar";
import Branch from "../../schemas/branch";
import CustomerInfo from "../../schemas/customerInfo";
import Item from "../../schemas/item";
import Redeem from "../../schemas/redeem";
import PawnTicket from "../../schemas/pawnTicket";
import Transaction from "../../schemas/transaction";
import User from "../../schemas/user";
import { ironOptions } from "../../utilities/config";
import dbConnect from "../../utilities/dbConnect";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		if (!req.session.userData && !query) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (
			req.session.userData.role == "manager" ||
			req.session.userData.role == "admin" ||
			(req.session.userData.role == "clerk" && query.pawnTicketID.length == 8)
		) {
			await dbConnect();
			let pawnTicketInfo = await PawnTicket.findOne({
				pawnTicketID: query.pawnTicketID,
			});
			let allItemList = await Item.find({
				itemListID: pawnTicketInfo.itemListID,
			}).lean();

			let redeemedItemList = await Redeem.find({
				pawnTicketID: query.pawnTicketID,
			}).lean();

			let itemList = [];

			// for (const item of allItemList) {
			// 	if(item.)
			// }

			let transactionInfo = await Transaction.findById(
				new mongoose.Types.ObjectId(pawnTicketInfo.transactionID)
			);
			let branchInfo = await Branch.findOne({
				branchID: transactionInfo.branchID,
			});

			let customerInfo = await User.findOne({
				userID: transactionInfo.customerID,
			});

			let customerInfoData = await CustomerInfo.findOne({
				userID: transactionInfo.customerID,
			});

			let clerkInfo = await User.findOne({ userID: transactionInfo.clerkID });

			let managerInfo = await User.findOne({
				userID: transactionInfo.managerID,
			});
			if (pawnTicketInfo) {
				return {
					props: {
						currentUser: req.session.userData,
						pawnTicketData: JSON.parse(JSON.stringify(pawnTicketInfo)),
						branchData: JSON.parse(JSON.stringify(branchInfo)),
						transactionData: JSON.parse(JSON.stringify(transactionInfo)),
						itemData: JSON.parse(JSON.stringify(itemList)),
						customerData: JSON.parse(JSON.stringify(customerInfo)),
						clerkData: JSON.parse(JSON.stringify(clerkInfo)),
						managerData: JSON.parse(JSON.stringify(managerInfo)),
						customerInfoData: JSON.parse(JSON.stringify(customerInfoData)),
					},
				};
			} else {
				return {
					redirect: { destination: "/", permanent: true },
					props: {},
				};
			}
		} else {
			return {
				redirect: { destination: "/", permanent: true },
				props: {},
			};
		}
	},
	ironOptions
);

function SearchPawnTicketID({
	currentUser,
	pawnTicketData,
	branchData,
	transactionData,
	itemData,
	customerData,
	clerkData,
	managerData,
	customerInfoData,
}) {
	const [showCustomer, setShowCustomer] = useState(false);

	console.log("item data:", itemData);

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<Modal isOpen={showCustomer} ariaHideApp={false} className="modal">
				<CustomerDetails
					trigger={showCustomer}
					setTrigger={setShowCustomer}
					customerInfo={customerInfoData}
					userInfo={customerData}
				/>
			</Modal>
			<div id="main-content-area">
				<div className="flex justify-between w-3/4 h-full p-5 border-2 border-gray-500 bg-green-50 font-nunito">
					<div>
						<span className="text-base font-bold">
							PT Number: {pawnTicketData.pawnTicketID}
						</span>
						<hr className="w-1/3 mt-5 border-gray-500"></hr>
						<div className="mt-5">
							<span className="text-base font-bold">Customer Details:</span>
							<span
								className="inline-block ml-3 hover:cursor-pointer"
								onClick={() => setShowCustomer(true)}
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
						</div>
						<div className="flex flex-row gap-5 mt-2 ml-5 text-base">
							<div className="flex flex-col text-end">
								<span>Full Name:</span>
								<span>Contact Number:</span>
								<span>Address:</span>
							</div>
							<div className="flex flex-col max-w-[50%] whitespace-pre-wrap">
								<span>
									{customerData.firstName +
										(customerData.middleName.length > 0
											? customerData.middleName.charAt(0) + " ."
											: " ") +
										customerData.lastName}
								</span>
								<span>{customerInfoData.contactNumber}</span>
								<span>{customerInfoData.presentAddress}</span>
							</div>
						</div>
						<hr className="w-1/3 mt-5 border-gray-500"></hr>
						<div className="mt-5">
							<span className="text-base font-bold">Pawn Details:</span>
						</div>
						<div className="flex flex-row gap-5 mt-2 ml-5 text-base">
							<div className="flex flex-col text-end">
								<span>Date Loan Granted:</span>
								<span>Maturity Date:</span>
								<span>Expiry Date:</span>
								<span>Branch:</span>
							</div>
							<div className="flex flex-col max-w-[50%] whitespace-pre-wrap">
								<span>
									{dayjs(pawnTicketData.loanDate).format("MMM DD, YYYY")}
								</span>
								<span>
									{dayjs(pawnTicketData.maturityDate).format("MMM DD, YYYY")}
								</span>
								<span>
									{dayjs(pawnTicketData.expiryDate).format("MMM DD, YYYY")}
								</span>
								<span>{branchData.branchName}</span>
							</div>
						</div>
					</div>
					<div className="flex flex-col text-base bg-blue-100">
						<span>
							<b>Loan Amount:</b> Php {pawnTicketData.loanAmount.toFixed(2)}
						</span>
						<span>asd{itemData.itemID}</span>
					</div>
				</div>
			</div>
		</>
	);
}

export default SearchPawnTicketID;
