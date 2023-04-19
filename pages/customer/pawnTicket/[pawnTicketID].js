import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CustomerHeader from "../../../components/customer/header";
import ItemCard from "../../../components/customer/itemCard";
import NavigationFooter from "../../../components/customer/navigationFooter";
import PawnTicket from "../../../schemas/pawnTicket";
import Branch from "../../../schemas/branch";
import Transaction from "../../../schemas/transaction";
import { ironOptions } from "../../../utilities/config";
import dbConnect from "../../../utilities/dbConnect";
import mongoose from "mongoose";
import dayjs from "dayjs";
import Image from "next/image";
import Item from "../../../schemas/item";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		if (!req.session.userData && !query) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (
			req.session.userData.role == "customer" &&
			query.pawnTicketID.length == 8
		) {
			await dbConnect();
			let pawnTicketInfo = await PawnTicket.findOne({
				pawnTicketID: query.pawnTicketID,
			});
			console.log("pt info:", pawnTicketInfo);
			let itemList = await Item.find({
				itemListID: pawnTicketInfo.itemListID,
				isRedeemed: false,
			}).lean();
			let transactionInfo = await Transaction.findById(
				new mongoose.Types.ObjectId(pawnTicketInfo.transactionID)
			);
			let branchInfo = await Branch.findOne({
				branchID: transactionInfo.branchID,
			});
			if (pawnTicketInfo) {
				return {
					props: {
						currentUser: req.session.userData,
						pawnTicketData: JSON.parse(JSON.stringify(pawnTicketInfo)),
						branchData: JSON.parse(JSON.stringify(branchInfo)),
						transactionData: JSON.parse(JSON.stringify(transactionInfo)),
						itemData: JSON.parse(JSON.stringify(itemList)),
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

function RenewPawnTicketID({
	currentUser,
	pawnTicketData,
	branchData,
	itemData,
}) {
	// console.log("PAWN TICKET DATA:", pawnTicketData);
	// console.log("BRANCH DATA:", branchData);
	// console.log("ITEM DATA:", itemData);
	const router = useRouter();
	const [loanDate, setLoanDate] = useState(new Date());
	const [newLoanAmount, setNewLoanAmount] = useState(0);
	const [amountToPay, setAmountToPay] = useState(0);
	const [partialPayment, setPartialPayment] = useState(0);
	const [advInterest, setAdvInterest] = useState(
		pawnTicketData.loanAmount * 0.035
	);
	const [interest, setInterest] = useState(
		pawnTicketData.loanAmount *
			0.035 *
			monthDiff(new Date(pawnTicketData.maturityDate), new Date())
	);
	const [penalties, setPenalties] = useState(
		pawnTicketData.loanAmount *
			0.01 *
			monthDiff(new Date(pawnTicketData.expiryDate), new Date())
	);
	const [minPayment, setMinPayment] = useState(
		interest * 2 + penalties + advInterest
	);

	function monthDiff(dateFrom, dateTo) {
		let diff =
			dateTo.getMonth() -
			dateFrom.getMonth() +
			12 * (dateTo.getFullYear() - dateFrom.getFullYear());
		if (diff > 0) {
			return diff;
		} else {
			return 0;
		}
	}

	function renewPawnTicket() {
		var base_url = window.location.origin;

		//send payment
		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				authorization: "Basic c2tfdGVzdF9kaUVONlRCeXBRVlNScEhzcFBWQlhuaUQ=",
			},
			body: JSON.stringify({
				data: {
					attributes: {
						amount: amountToPay * 100,
						redirect: {
							success: base_url + "/customer/pawnTicket/success",
							failed: base_url + "/customer/pawnTicket/failed",
						},
						type: "gcash",
						currency: "PHP",
					},
				},
			}),
		};

		fetch("https://api.paymongo.com/v1/sources", options)
			.then((response) => response.json())
			.then((response) => {
				console.log("RES:", response.data.id);
				localStorage.clear();
				localStorage.setItem("sourceID", response.data.id);
				localStorage.setItem(
					"pawnTicketData",
					JSON.stringify({
						amountPaid: amountToPay,
						oldPawnTicketID: pawnTicketData.pawnTicketID,
						newLoanAmount: newLoanAmount,
						branchName: branchData.branchName,
					})
				);
				window.open(response.data.attributes.redirect.checkout_url, "_self");
			});
	}

	useEffect(() => {
		if (!pawnTicketData.isInactive) {
			if (amountToPay > minPayment) {
				let amountLeftFromCash = amountToPay - interest - penalties;
				let partialPayment =
					(amountLeftFromCash - pawnTicketData.loanAmount * 0.035) / 0.965;
				let newLoanAmount = pawnTicketData.loanAmount - partialPayment;
				let tempAdvInterest = newLoanAmount * 0.035;
				console.log("new:", newLoanAmount);
				if (newLoanAmount > pawnTicketData.loanAmount) {
					setNewLoanAmount(pawnTicketData.loanAmount);
					setAdvInterest(pawnTicketData.loanAmount * 0.035);
				} else if (newLoanAmount < 2500) {
					setPartialPayment(0);
					setAdvInterest(tempAdvInterest);
					setNewLoanAmount(newLoanAmount);
					document.getElementById("amount_to_pay_input").style.borderColor =
						"red";
				} else {
					setAdvInterest(tempAdvInterest);
					setNewLoanAmount(newLoanAmount);
					setPartialPayment(partialPayment < 0 ? 0 : partialPayment);
					document.getElementById("amount_to_pay_input").style.borderColor =
						"black";
				}
			} else {
				document.getElementById("amount_to_pay_input").style.borderColor =
					"red";
				setMinPayment(pawnTicketData.loanAmount * 0.035 + interest + penalties);
			}
		}
	}, [amountToPay]);

	useEffect(() => {
		setMinPayment(pawnTicketData.loanAmount * 0.035);
	}, []);

	function convertFloat(number) {
    return Number(number).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
	return (
		<div className="flex flex-col items-center">
			<div className="fixed flex flex-col items-center w-full h-full border-2 md:w-1/4 ">
				<CustomerHeader></CustomerHeader>
				<div className="w-full h-full overflow-y-auto bg-green-50">
					<div className="flex flex-col items-center w-full h-full p-1 mt-2">
						<div className="w-full p-2 text-sm bg-gray-100 border-2 border-gray-300 h-fit font-nunito">
							{pawnTicketData.isInactive ? (
								<h1 className="text-base font-bold text-center text-red-500 bg-gray-200">
									PawnTicket Inactive!
								</h1>
							) : (
								<></>
							)}
							<div className="flex flex-row justify-between">
								<div className="flex flex-col text-end w-fit">
									<span className="font-semibold">
										{pawnTicketData.pawnTicketID}
									</span>
									<span className="text-[0.9rem] text-gray-400">PT Number</span>
								</div>
								<div className="flex flex-col text-end w-fit ">
									<span className="font-semibold">
										Php {convertFloat(pawnTicketData.loanAmount)}
									</span>
									<span className="text-[0.9rem] text-gray-400">
										Loan Amount
									</span>
								</div>
							</div>
							<h1 className="mt-5 text-base">Pawn Details</h1>
							<div className="flex flex-row gap-2">
								<div className="flex flex-col items-end">
									<span>Branch:</span>
									<span>Date Loan Granted:</span>
									<span>Maturity Date:</span>
									<span>Expiry Date:</span>
								</div>
								<div className="flex flex-col items-start">
									<span>{branchData.branchName}</span>
									<span>
										{dayjs(pawnTicketData.loanDate).format("MMM DD, YYYY")}
									</span>
									<span>
										{dayjs(pawnTicketData.maturityDate).format("MMM DD, YYYY")}
									</span>
									<span>
										{dayjs(pawnTicketData.expiryDate).format("MMM DD, YYYY")}
									</span>
								</div>
							</div>
							<hr className="mt-5"></hr>
							<h1 className="text-base">Pawned Items</h1>
							<div>
								<div>
									{itemData.map((item) => (
										<ItemCard key={item.itemID} item={item}></ItemCard>
									))}
								</div>
							</div>
							<hr className="mt-5"></hr>
							{pawnTicketData.isInactive ? (
								<></>
							) : (
								<>
									<h1 className="text-base">Renewal Details</h1>
									<div className="flex flex-row gap-2">
										<div className="flex flex-col items-end">
											<span>
												<b>New</b> Date Loan Granted:
											</span>
											<span>
												<b>New</b> Maturity Date:
											</span>
											<span>
												<b>New</b> Expiry Date:
											</span>
										</div>
										<div className="flex flex-col items-start">
											<span>{dayjs(loanDate).format("MMM DD, YYYY")}</span>
											<span>
												{dayjs(loanDate).add(1, "M").format("MMM DD, YYYY")}
											</span>
											<span>
												{dayjs(loanDate).add(4, "M").format("MMM DD, YYYY")}
											</span>
										</div>
									</div>
									<hr className="mt-5"></hr>
									<h1 className="text-base">Computations</h1>
									<div className="flex flex-row gap-2 mb-5">
										<div className="flex flex-col items-end">
											<span>Loan Amount:</span>
											<span>Interest:</span>
											<span>Adv. Interest:</span>
											<span>Penalties:</span>
											<span>Partial Payment:</span>
											<span>Remaining Balance:</span>
										</div>
										<div className="flex flex-col items-end">
											<span>Php {convertFloat(pawnTicketData.loanAmount.toFixed(2))}</span>
											<span>Php {convertFloat(interest.toFixed(2))}</span>
											<span>
												Php{" "}
												{advInterest >= 0
													? convertFloat(advInterest)
													: "----------"}
											</span>
											<span>Php {convertFloat(penalties)}</span>
											<span>
												Php{" "}
												{partialPayment >= 0
													? convertFloat(partialPayment)
													: "----------"}
											</span>
											<span>
												Php{" "}
												{newLoanAmount >= 0
													? convertFloat(newLoanAmount)
													: "----------"}
											</span>
										</div>
									</div>
									{newLoanAmount < 2500 && newLoanAmount != 0 ? (
										<div className="text-center">
											<span className="text-sm text-red-500">
												Remaining balance is below Php 2,500.00. Please redeem
												the PawnTicket or lessen the amount to pay.
											</span>
										</div>
									) : (
										<></>
									)}
									<div className="flex flex-col justify-center w-full text-center ">
										<h1>Amount To Pay</h1>
										<input
											type="number"
											value={amountToPay}
											id="amount_to_pay_input"
											onChange={(e) =>
												setAmountToPay(parseFloat(e.target.value))
											}
										></input>
										<div className="flex flex-col justify-center gap-2">
											<span>
												Minimum Payment:{" "}
												{minPayment >= amountToPay ? (
													<span className="font-semibold text-red-500">
														Php {convertFloat(minPayment)}
													</span>
												) : (
													<>Php {convertFloat(minPayment)}</>
												)}
											</span>
										</div>
									</div>
									<div className="flex flex-col items-center justify-center m-5">
										<button
											onClick={() => renewPawnTicket()}
											className="mb-[15vh] bg-green-300"
											disabled={
												minPayment >= amountToPay ||
												isNaN(amountToPay) ||
												amountToPay >= pawnTicketData.loanAmount ||
												newLoanAmount < 2500
											}
										>
											Renew PawnTicket
										</button>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
				<NavigationFooter currentUser={currentUser}></NavigationFooter>
			</div>
		</div>
	);
}

export default RenewPawnTicketID;
