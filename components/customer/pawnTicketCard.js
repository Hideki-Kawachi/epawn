import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";
import LikeButton from "./likeButton";

function PawnTicketCard({ pawnTicketData }) {
	const router = useRouter();

	function showAlert() {
		let maturityDate = new Date(pawnTicketData.maturityDate);
		let expiryDate = new Date(pawnTicketData.expiryDate);
		let dateNow = new Date();
		if (maturityDate < dateNow) {
			return (
				<div className="flex flex-col items-center justify-center p-2 bg-red-300 rounded-full w-fit col">
					<span className="text-sm text-white">Past Due!</span>
				</div>
			);
		} else if (expiryDate < dateNow) {
			return (
				<div className="flex flex-col items-center justify-center p-2 bg-red-300 rounded-full w-fit col">
					<span className="text-sm text-white">Past Expiry!</span>
				</div>
			);
		}
	}
	return (
		<>
			<div
				className="flex justify-between w-full p-2 leading-none bg-gray-100 border-2 border-gray-300 rounded-md shadow cursor-pointer h-fit"
				onClick={() =>
					router.push({
						pathname: "/customer/pawnTicket/[pawnTicketID]",
						query: { pawnTicketID: pawnTicketData.pawnTicketID },
					})
				}
			>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col text-end w-fit">
						<span>{pawnTicketData.pawnTicketID}</span>
						<span className="text-[0.9rem] text-gray-400">PT Number</span>
					</div>
					<div className="flex flex-col text-end w-fit">
						<span>
							{dayjs(pawnTicketData.maturityDate).format("MMM DD, YYYY")}
						</span>
						<span className="text-[0.9rem] text-gray-400">Maturity Date</span>
					</div>
				</div>
				<div className="flex flex-col items-end gap-2">
					<div className="flex flex-col text-end w-fit ">
						<span className="font-semibold">
							Php {pawnTicketData.loanAmount.toFixed(2)}
						</span>
						<span className="text-[0.9rem] text-gray-400">Loan Amount</span>
					</div>
					{showAlert()}
				</div>
			</div>

			<div className="absolute flex flex-col mt-16 ml-auto cursor-pointer right-10 text-end w-fit">
				<LikeButton></LikeButton>
			</div>
		</>
	);
}

export default PawnTicketCard;
