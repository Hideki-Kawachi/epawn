import React from "react";
import NavigationFooter from "../../../components/customer/navigationFooter";
import Image from "next/image";
import CustomerHeader from "../../../components/customer/header";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";
import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import PawnTicket from "../../../schemas/pawnTicket";
import Item from "../../../schemas/item";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "customer") {
			await dbConnect();
			let transactionInfo = await Transaction.find({
				customerID: req.session.userData.userID,
			});
			let pawnTicketInfo = await PawnTicket.find({
				customerID: req.session.userData.userID,
			});
			return {
				props: {
					currentUser: req.session.userData,
					transactionData: JSON.parse(JSON.stringify(transactionInfo)),
					pawnTicketData: JSON.parse(JSON.stringify(pawnTicketInfo)),
				},
			};
		} else {
			return {
				redirect: { destination: "/", permanent: true },
				props: {},
			};
		}
	},
	ironOptions
);

function PastTransactions({
	currentUser,
	transactionData,
	pawnTicketData,
	itemData,
}) {
	console.log("trans data:", transactionData);
	console.log("pt data:", pawnTicketData);
	return (
		<div className="flex flex-col items-center">
			<div className="fixed flex flex-col items-center w-full h-full border-2 md:w-1/4">
				<CustomerHeader></CustomerHeader>
				<div className="w-full h-full overflow-y-auto bg-green-50 ">
					<div className="flex flex-col items-center w-full h-full mt-[10vh]">
						<span>PAST TRANSACTIONS</span>
					</div>
				</div>
				<NavigationFooter currentUser={currentUser}></NavigationFooter>
			</div>
		</div>
	);
}

export default PastTransactions;
