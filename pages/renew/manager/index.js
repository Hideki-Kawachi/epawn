import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import dbConnect from "../../../utilities/dbConnect";
import mongoose from "mongoose";
import NotifTable from "../../api/notifTable";
import RenewTable from "../../../components/renew/renewTable";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";
import Transaction from "../../../schemas/transaction";
import Renew from "../../../schemas/renew";
import User from "../../../schemas/user";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "customer") {
			return {
				redirect: { destination: "/customer", permanent: true },
				props: {},
			};
		} else {
			await dbConnect();

			let transactionData;
			let renewData;
			let customerData = await User.find({ isDisabled: false }).lean();

			transactionData = await Transaction.find({
				branchID: req.session.userData.branchID,
				managerID: req.session.userData.userID,
				transactionType: { $regex: "Renew" },
				status: { $ne: "done" },
			})
				.sort({ updatedAt: -1 })
				.lean();

			renewData = await Renew.find({}).lean();

			// console.log("trans data: ", transactionData);
			//console.log("renew data: ", renewData);

			let notifData = [];
			transactionData.forEach((transaction) => {
				let customerInfo = customerData.find(
					(customer) => customer.userID == transaction.customerID
				);
				//looks for PT number of that transaction
				renewData.forEach((renew) => {
					if (renew.transactionID == transaction._id) {
						transaction.ptNumber = renew.prevPawnTicketID;
					}
				});

				if (customerInfo) {
					notifData.push({
						_id: transaction._id,
						customerName: customerInfo.firstName + " " + customerInfo.lastName,
						date: transaction.updatedAt
							.toDateString()
							.substring(4, transaction.creationDate.length),
						time: transaction.updatedAt.toLocaleTimeString("en-GB"),
						transactionType: transaction.transactionType,
						ptNumber: transaction.ptNumber,
						amountPaid: "Php " + convertFloat(transaction.amountPaid),
						status: transaction.status,
					});
				}
			});
			return {
				props: {
					currentUser: req.session.userData,
					notifData: JSON.parse(JSON.stringify(notifData)),
				},
			};
		}
	},
	ironOptions
);

function convertFloat(number) {
	return Number(number).toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export default function Home({ currentUser, notifData }) {
	const [showData, setShowData] = useState(notifData);

	useEffect(() => {
		waitNotif();
	}, [showData]);

	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			{/* First Half */}

			<Modal isOpen={submitModal} ariaHideApp={false} className="modal">
				<Submit trigger={submitModal} setTrigger={setSubmitOpen} />
			</Modal>

			<Modal isOpen={cancelModal} ariaHideApp={false} className="modal">
				<Cancel
					trigger={cancelModal}
					setTrigger={setCancelOpen}
					content={cancelContentShow()}
				/>
			</Modal>

			<div id="main-content-area" className="flex-col ">
				<p className="text-xl font-semibold text-green-500 underline font-dosis">
					Renew
				</p>
				<p className="mb-5 text-lg text-green-500 font-dosis">
					On-site Renewal (Manager)
				</p>

				<div className="flex">
					<DetailsCardRenewManager></DetailsCardRenewManager>
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
								<p>12/09/2022</p>
								<p>01/09/2022</p>
								<p>02/09/2022</p>
							</div>
						</div>
					</div>

					{/*Items*/}
					<div className="">
						<p className="ml-10 text-base font-bold font-nunito">Items: </p>
						<div className="bg-white px-5 mx-10 w-[720px] h-[280px] overflow-y-scroll border-2">
							{itemList.map((items, index) => (
								<ItemCard
									key={index}
									itemID={items.ItemID}
									itemName={items.Name}
									itemType={items.Type}
									itemPrice={items.Price}
								></ItemCard>
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
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
