import React, { useState, useEffect } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import DetailsCardRenewManager from "../../../components/renew/detailsManager";
import Modal from "react-modal";
import Submit from "../../../components/modals/submitManagerRenew";
import Cancel from "../../../components/modals/cancel";
import Branch from "../../../schemas/branch";
import PawnTicket from "../../../schemas/pawnTicket";
import ItemCard from "../../../components/itemcard";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import { ironOptions } from "../../../utilities/config";
import dayjs from "dayjs";
import printPawnTicket from "../../../utilities/printPawnTicket";
import printReceipt from "../../../utilities/printReceipt";
import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import mongoose from "mongoose";
import LoadingSpinner from "../../../components/loadingSpinner";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "manager" && query.transactionID) {
			if (query.transactionID.length >= 24) {
				await dbConnect();
				let transactionInfo = await Transaction.findById(
					new mongoose.Types.ObjectId(query.transactionID)
				);
				let br = await Branch.findOne({
					branchID: transactionInfo.branchID,
				});

				let pawnTicketData = await PawnTicket.find({
					itemListID: transactionInfo.itemListID,
				}).sort({ loanDate: -1 });

				let pawnHistory = [];

				for (let ticket of pawnTicketData) {
					let transaction = await Transaction.findOne({
						_id: ticket.transactionID,
						status: { $in: ["Done", "Approved"] },
					});

					let branch = await Branch.findOne({
						branchID: transaction.branchID,
					});

					let amountPaid = 0;
					if (transaction.amountPaid > 0) {
						amountPaid = transaction.amountPaid;
					} else amountPaid = 0;

					if (branch && transaction) {
						pawnHistory.push({
							pawnTicketID: ticket.pawnTicketID,
							transactionType: transaction.transactionType,
							branchID: branch.branchName,
							loanDate: dayjs(ticket.loanDate).format("MM/DD/YYYY"),

							amountPaid:
								"Php " +
								amountPaid.toLocaleString("en-US", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								}),
							loanAmount:
								"Php " +
								ticket.loanAmount.toLocaleString("en-US", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								}),
						});
					}
				}
				return {
					props: {
						currentUser: req.session.userData,
						transactionData: JSON.parse(JSON.stringify(transactionInfo)),
						pawnHistory: JSON.parse(JSON.stringify(pawnHistory)),
						branchData: JSON.parse(JSON.stringify(br)),
					},
				};
			}

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

function RenewManager({
	currentUser,
	transactionData,
	pawnHistory,
	branchData,
}) {
	// Modals
	const [submitModal, setSubmitOpen] = useState(false); //Submit
	const [cancelModal, setCancelOpen] = useState(false); //Cancel
	const [loading, setLoading] = useState(false);
	//Item List Array
	const [itemList, setitemList] = useState([]);

	//Pawn Ticket Details
	const [PTNumber, setPTNumber] = useState(""); //test A-123456
	const [ptInfo, setPTinfo] = useState([]);
	const [branch, setBranch] = useState("N/A");
	const [customerID, setCustomerID] = useState("N/A");
	const [customerDetails, setCusDetails] = useState(["N/A"]);
	const [amountToPay, setAmountToPay] = useState(0);
	const [newLoan, setNewLoan] = useState(0);
	const [renewID, setRenewID] = useState("N/A");
	const [userInfo, setUserInfo] = useState([]);
	const [cashTendered, setCashTendered] = useState(0);
	const router = useRouter();

	//Item List Backend States
	const [itemListID, setItemListID] = useState("N/A");
	const [transactionID, setTransactionID] = useState(
		router.query.transactionID
	);
	const [sendForm, setSendForm] = useState(false);
	const [button, setButton] = useState(true); //disabled if PT number is invalid

	console.log("transa:", transactionData);

	function submitForm() {
		setSubmitOpen(true);
	}

	function cancelForm() {
		setCancelOpen(true);
	}

	function cancelContentShow() {
		return (
			<>
				Are you sure you want to cancel <b> Redemption</b> of <br />
				<b>{PTNumber}</b>? <br /> <br />
				All unsubmitted data will be lost.
			</>
		);
	}
	function cancelContentShow() {
		return (
			<>
				Are you sure you want to cancel <b> Renewal </b> transaction?
				<br />
				All unsubmitted data will be lost.
			</>
		);
	}

	function getNewLoanDate() {
		const dt = new Date();
		return dayjs(dt).format("MM/DD/YYYY");
	}

	function getNewMaturityDate() {
		const dt = new Date();
		const nt = new Date().setDate(dt.getDate() + 120);
		return dayjs(nt).format("MM/DD/YYYY");
	}

	function getNewExpiryDate() {
		const dt = new Date();
		const nt = new Date().setDate(dt.getDate() + 30);
		return dayjs(nt).format("MM/DD/YYYY");
	}

	useEffect(() => {
		if (transactionID != "N/A") {
			//	setLoading(true)
			fetch("/api/redeem/" + transactionID, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((transaction) => {
					//console.log("Trans is now " + JSON.stringify(transaction._id))
					//  console.log("TransactionID is " + transactionID)
					if (transaction != null) {
						setCustomerID(transaction.customerID);
						setBranch(transaction.branchID);
						setAmountToPay(transaction.amountPaid);
					}
				});
		}
		if (transactionID != "N/A") {
			fetch("/api/renewal/" + transactionID, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((renew) => {
					// console.log(data)
					if (renew != null) {
						setRenewID(renew.renewID);
						setPTNumber(renew.prevPawnTicketID);

						console.log("PT is " + PTNumber);
					}
				});
		}
	}, [transactionID, PTNumber]);

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
						setPTinfo(data);
						setItemListID(data.itemListID);
					}
				});
		}
	}, [PTNumber]);

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
					}
				});
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
					// console.log(data)
					if (user != null) {
						// console.log(JSON.stringify(info))
						setUserInfo(user);
					}
				});
		}
	}, [customerID]);

	// BACKEND TO RETRIEVE CUSTOMER DETAILS WITH USERID
	useEffect(() => {
		if (customerID != "N/A") {
			fetch("/api/users/customers/" + customerID, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((customer) => {
					// console.log(data)
					if (customer != null) {
						setCusDetails(JSON.parse(JSON.stringify(customer)));
					}
				});
		}
		//	setLoading(false)
	}, [customerID]);
	//SUBMIT FORM
	useEffect(() => {
		if (sendForm) {
			setLoading(true);
			if (customerID) {
				let transac = {
					transactionID: router.query.transactionID,
					customerID: customerID,
					itemListID: itemListID,
					newLoanAmount: newLoan,
					oldPawnTicket: PTNumber,
					branchID: branch,
					clerkID: transactionData.clerkID,
					transactionType: transactionData.transactionType,
				};
				// console.log("transac is" + JSON.stringify(transac))
				fetch("/api/renewal/newManagerRenewal", {
					method: "POST",
					body: JSON.stringify(transac),
				})
					.then((res) => res.json())
					.then((data) => {
						console.log("DATA IS:", data);
						if (data != "error") {
							printPawnTicket(data.pawnTicketData);
							printReceipt(data.receiptData);
							router.replace("/");
						} else {
							console.log("error");
						}
					});
			}
			console.log("send form:");
		}
	}, [sendForm, customerID]);

	useEffect(() => {
		if (cashTendered >= amountToPay) {
			setButton(false);
		} else setButton(true);
	}, [cashTendered, amountToPay]);
	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			{/* First Half */}
			<Modal isOpen={submitModal} ariaHideApp={false} className="modal">
				<Submit
					trigger={submitModal}
					setTrigger={setSubmitOpen}
					PTnumber={PTNumber}
					itemList={itemList}
					setSendForm={setSendForm}
					sendForm={sendForm}
					submitForm={submitForm}
					amountToPay={amountToPay}
				/>
			</Modal>

			<Modal isOpen={cancelModal} ariaHideApp={false} className="modal">
				<Cancel
					trigger={cancelModal}
					setTrigger={setCancelOpen}
					content={cancelContentShow()}
				/>
			</Modal>

			<LoadingSpinner isLoading={loading}></LoadingSpinner>
			<div id="main-content-area" className="flex-col ">
				<p className="text-xl font-semibold text-green-500 underline font-dosis">
					Renew
				</p>
				<p className="mb-5 text-lg text-green-500 font-dosis">
					On-site Renewal (Manager)
				</p>

				<div className="flex">
					<DetailsCardRenewManager
						branch={branchData.branchName}
						pawnHistory={pawnHistory}
						pawnTicket={ptInfo}
						PTNumber={PTNumber}
						user={userInfo}
						customer={customerDetails}
						amountToPay={amountToPay}
						cashTendered={cashTendered}
						setCashTendered={setCashTendered}
						newLoan={newLoan}
						getNewLoan={setNewLoan}
					/>
				</div>

				{/* Second Half */}

				<div className="flex py-10 mt-20 bg-white shadow-lg rounded-xl">
					{/* Remaining Items  */}

					<div className="px-5">
						<p className="ml-10 text-base font-bold font-nunito">
							New Pawn Details:{" "}
						</p>

						<div className="flex my-10 ml-5 mr-6 text-base font-nunito">
							<div className="ml-5 text-right">
								<p>
									<b>
										<i>New </i>
									</b>
									Date Loan Granted:
								</p>
								<p>
									<b>
										<i>New </i>
									</b>
									Maturity Date:
								</p>
								<p>
									<b>
										<i>New </i>
									</b>
									Expiry Date of Redemption:
								</p>
							</div>
							<div className="ml-8 text-left">
								<p>{getNewLoanDate()}</p>
								<p>{getNewMaturityDate()}</p>
								<p>{getNewExpiryDate()}</p>
							</div>
						</div>
					</div>

					{/*Items*/}
					<div className="">
						<p className="ml-10 text-base font-bold font-nunito">Items: </p>
						<div className="bg-white px-5 mx-10 w-[720px] h-[280px] overflow-y-scroll border-2">
							{itemList.map((item) => (
								<div className="flex flex-row" key={item.itemID}>
									<ItemCard key={item.itemID} itemDetails={item}></ItemCard>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="mt-5 flex flex-row ml-[1180px]">
					<div>
						<button
							className="px-10 mx-2 my-5 text-base text-white bg-red-300"
							onClick={cancelForm}
						>
							Cancel
						</button>
					</div>
					<div>
						<button
							className="px-10 mx-2 my-5 text-base text-white bg-green-300"
							onClick={submitForm}
							disabled={button}
						>
							Approve
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default RenewManager;
