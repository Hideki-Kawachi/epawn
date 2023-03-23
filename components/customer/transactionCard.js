import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";

function TransactionCard({ pawnTicketData, transactionData }) {
	const router = useRouter();
	return (
		<div
			className="flex justify-between w-full p-2 leading-none bg-gray-100 border-2 border-gray-300 rounded-md shadow h-fit"
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
				<div className="flex flex-col text-start w-fit">
					<span>{transactionData.transactionType}</span>
					<span className="text-[0.9rem] text-gray-400">Transaction Type</span>
				</div>
			</div>
			<div className="flex flex-col items-end gap-4">
				<div className="flex flex-col text-end w-fit ">
					{transactionData.transactionType == "Pawn" ? (
						<>
							{" "}
							<span className="font-bold text-green-400">
								Php {pawnTicketData.loanAmount.toFixed(2)}
							</span>
							<span className="text-[0.9rem] text-gray-400">
								Amount Received
							</span>
						</>
					) : (
						<>
							<span className="font-bold text-red-500">
								Php {transactionData.amountPaid.toFixed(2)}
							</span>
							<span className="text-[0.9rem] text-gray-400">Amount Paid</span>
						</>
					)}
				</div>
				<div className="flex flex-col text-end w-fit ">
					<div className="flex flex-col text-end w-fit">
						<span>
							{dayjs(transactionData.updatedAt).format("MMM DD, YYYY")}
						</span>
						<span className="text-[0.9rem] text-gray-400">
							Date of Transaction
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TransactionCard;
