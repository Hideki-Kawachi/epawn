import React, { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";
import { useRouter } from "next/router";
import NavigationFooter from "../../../components/customer/navigationFooter";
import CustomerHeader from "../../../components/customer/header";
import PawnTicketCard from "../../../components/customer/pawnTicketCard";
import dbConnect from "../../../utilities/dbConnect";
import PawnTicket from "../../../schemas/pawnTicket";

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
			return {
				props: {
					currentUser: req.session.userData,
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

function PawnTicketIndex({ currentUser, pawnTicketData }) {
	const router = useRouter();
	const [pawnTicketShow, setPawnTicketShow] = useState(pawnTicketData);
	const [search, setSearch] = useState("");

	useEffect(() => {
		let tempList = [];
		pawnTicketData.forEach((pt) => {
			if (pt.pawnTicketID.includes(search)) {
				tempList.push(pt);
			}
		});
		setPawnTicketShow(tempList);
	}, [search]);

	return (
		<div className="flex flex-col items-center">
			<div className="fixed flex flex-col items-center w-full h-full border-2 md:w-1/4">
				<CustomerHeader></CustomerHeader>
				<div className="w-full h-full overflow-y-auto bg-green-50 ">
					<div className="flex flex-col items-center w-full h-full mt-[3vh] font-nunito text-sm">
						<h1 className="mb-5 text-base font-bold text-center">
							My PawnTickets
						</h1>
						<div className="flex flex-row w-full gap-2 px-4">
							<span>Search: </span>
							<input
								type="text"
								className="w-full"
								onChange={(e) => setSearch(e.target.value)}
								placeholder="PT Number"
							></input>
						</div>

						<div className="flex flex-col w-full gap-2 p-3 mt-3">
							{pawnTicketShow.map((pt) => (
								<PawnTicketCard
									key={pt.pawnTicketID}
									pawnTicketData={pt}
								></PawnTicketCard>
							))}
							{/* <PawnTicketCard
								pawnTicketData={{
									pawnTicketID: "A-123456",
									maturityDate: "2023-04-18T04:44:29.639+00:00",
									loanAmount: 18000,
								}}
							></PawnTicketCard> */}
						</div>
					</div>
				</div>
				<NavigationFooter currentUser={currentUser}></NavigationFooter>
			</div>
		</div>
	);
}

export default PawnTicketIndex;
