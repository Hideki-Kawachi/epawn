import React from "react";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../utilities/config";
import { useRouter } from "next/router";
import NavigationFooter from "../../components/customer/navigationFooter";
import CustomerHeader from "../../components/customer/header";
import dbConnect from "../../utilities/dbConnect";
import PawnTicket from "../../schemas/pawnTicket";
import Transaction from "../../schemas/transaction";
import InboxCard from "../../components/customer/inboxCard";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "customer") {
			await dbConnect();
			let pawnTicketInfo = await PawnTicket.find({
				customerID: req.session.userData.userID,
				isInactive: false,
			}).lean();
			let transactionInfo = await Transaction.find({
				customerID: req.session.userData.userID,
			});
			let transasctionData = [];
			for (const transaction of transactionInfo.reverse()) {
				let ptInfo = pawnTicketInfo.find(
					(pt) => pt.transactionID == transaction._id
				);
				if (ptInfo) {
					transasctionData.push({
						pawnTicket: ptInfo,
						transaction: transaction,
					});
				}
			}
			console.log("transaction Data:", transasctionData);
			return {
				props: {
					currentUser: req.session.userData,
					showData: JSON.parse(JSON.stringify(transasctionData)),
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

function Inbox({ currentUser, showData }) {
	const router = useRouter();

	return (
		<div className="flex flex-col items-center">
			<div className="fixed flex flex-col items-center w-full h-full border-2 md:w-1/4">
				<CustomerHeader></CustomerHeader>
				<div className="w-full h-full overflow-y-auto bg-green-50 ">
					<div className="flex flex-col items-center w-full h-full mt-[3vh] font-nunito text-sm">
						<h1 className="w-full mb-5 text-base font-bold text-center">
							My Inbox
						</h1>
						<div className="flex flex-col w-full gap-2 p-3 pb-40">
							{showData.map((data) => (
								<InboxCard
									key={data.pawnTicket.pawnTicketID}
									pawnTicketData={data.pawnTicket}
									transactionData={data.transaction}
								></InboxCard>
							))}
						</div>
					</div>
				</div>
				<NavigationFooter currentUser={currentUser}></NavigationFooter>
			</div>
		</div>
	);
}

export default Inbox;
