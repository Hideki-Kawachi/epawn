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
	const [advInterest, setAdvInterest] = useState(0);
	const [interest, setInterest] = useState(pawnTicketData.loanAmount * 0.035);
	const [penalties, setPenalties] = useState(0);
	const [minPayment, setMinPayment] = useState(interest * 2 + penalties);

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
					})
				);
				window.open(response.data.attributes.redirect.checkout_url, "_self");
			});
	}

	useEffect(() => {
		let amountLeftFromCash = amountToPay - interest - penalties;
		let partialPayment =
			(amountLeftFromCash - pawnTicketData.loanAmount * 0.035) / 0.965;
		let newLoanAmount = pawnTicketData.loanAmount - partialPayment;
		let advInterest = newLoanAmount * 0.035;
		setAdvInterest(advInterest);
		setNewLoanAmount(newLoanAmount);
		setPartialPayment(partialPayment < 0 ? 0 : partialPayment);
		if (amountToPay < minPayment) {
			console.log("NO");
			document.getElementById("amount_to_pay_input").style.borderColor = "red";
		}
	}, [amountToPay]);

	return (
		<div className="flex flex-col items-center">
			<div className="fixed flex flex-col items-center w-full h-full border-2 md:w-1/4 ">
				<CustomerHeader></CustomerHeader>
				<div className="w-full h-full mb-20 overflow-y-auto bg-green-50">
					<div className="flex flex-col items-center w-full h-full mt-[2vh] p-1">
						<div className="w-full p-2 text-sm bg-gray-100 border-2 border-gray-300 h-fit font-nunito">
							<div className="flex flex-row justify-between">
								<div className="flex flex-col text-end w-fit">
									<span className="font-semibold">
										{pawnTicketData.pawnTicketID}
									</span>
									<span className="text-[0.9rem] text-gray-400">PT Number</span>
								</div>
								<div className="flex flex-col text-end w-fit ">
									<span className="font-semibold">
										Php {pawnTicketData.loanAmount.toFixed(2)}
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
										{dayjs(loanDate).add(2, "M").format("MMM DD, YYYY")}
									</span>
								</div>
							</div>
							<hr className="mt-5"></hr>
							<h1 className="text-base">Computations</h1>
							<div className="flex flex-row gap-2">
								<div className="flex flex-col items-end">
									<span>Loan Amount:</span>
									<span>Interest:</span>
									<span>Adv. Interest:</span>
									<span>Penalties:</span>
									<span>Partial Payment:</span>
									<span>Remaining Balance:</span>
								</div>
								<div className="flex flex-col items-end">
									<span>Php {pawnTicketData.loanAmount}</span>
									<span>Php {interest.toFixed(2)}</span>
									<span>
										Php{" "}
										{advInterest >= 0 ? advInterest.toFixed(2) : "----------"}
									</span>
									<span>Php {penalties.toFixed(2)}</span>
									<span>
										Php{" "}
										{partialPayment >= 0
											? partialPayment.toFixed(2)
											: "----------"}
									</span>
									<span>
										Php{" "}
										{newLoanAmount >= 0
											? newLoanAmount.toFixed(2)
											: "----------"}
									</span>
								</div>
							</div>
							<div className="flex flex-col justify-center w-full mt-5 text-center ">
								<h1>Amount To Pay</h1>
								<input
									type="number"
									value={amountToPay}
									id="amount_to_pay_input"
									onChange={(e) => setAmountToPay(parseFloat(e.target.value))}
								></input>
								<span>
									Minimum Payment:{" "}
									{minPayment >= amountToPay ? (
										<span className="font-semibold text-red-500">
											Php {minPayment.toFixed(2)}
										</span>
									) : (
										<>Php {minPayment.toFixed(2)}</>
									)}
								</span>
							</div>
							<div className="flex flex-col items-center justify-center m-5">
								<button
									onClick={() => renewPawnTicket()}
									className="bg-green-300"
									disabled={minPayment >= amountToPay || isNaN(amountToPay)}
								>
									Renew PawnTicket
								</button>
							</div>
						</div>
					</div>
				</div>
				<NavigationFooter currentUser={currentUser}></NavigationFooter>
			</div>
		</div>
	);
}

export default RenewPawnTicketID;