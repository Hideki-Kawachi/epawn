import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";

function InboxCard({ pawnTicketData, transactionData }) {
	const router = useRouter();

	function showTransactionType() {
		if (
			monthDiff(new Date(), new Date(pawnTicketData.expiryDate)) < 0 &&
			monthDiff(new Date(), new Date(pawnTicketData.expiryDate)) > -6 &&
			dayjs(new Date()).format("MMM DD, YYYY") !=
				dayjs(new Date(pawnTicketData.expiryDate)).format("MMM DD, YYYY")
		) {
			return "Last Redemption Reminder";
		} else if (
			monthDiff(new Date(), new Date(pawnTicketData.expiryDate)) <= 1
		) {
			return "Expiry Date Reminder";
		} else if (
			monthDiff(new Date(), new Date(pawnTicketData.maturityDate)) <= 1
		) {
			return "Maturity Date Reminder";
		}
	}

	function showMessage() {
		let inboxShow = showTransactionType();
		if (inboxShow == "Expiry Date Reminder") {
			return (
				"PawnTicket " +
				pawnTicketData.pawnTicketID +
				" will expire on " +
				dayjs(new Date(pawnTicketData.expiryDate)).format("MMM DD, YYYY") +
				". Please renew or redeem the PawnTicket to avoid paying additional penalties."
			);
		} else if (inboxShow == "Maturity Date Reminder") {
			return (
				"PawnTicket " +
				pawnTicketData.pawnTicketID +
				" will mature on " +
				dayjs(new Date(pawnTicketData.maturityDate)).format("MMM DD, YYYY") +
				". Please renew or redeem the PawnTicket to avoid paying additional interest."
			);
		} else if (inboxShow == "Last Redemption Reminder") {
			return (
				"The last redemption of PawnTicket " +
				pawnTicketData.pawnTicketID +
				" will be on " +
				dayjs(new Date(pawnTicketData.expiryDate))
					.add(6, "M")
					.format("MMM DD, YYYY") +
				". You will not be able to redeem the items once the date has passed."
			);
		}
	}

	function monthDiff(dateFrom, dateTo) {
		let diff =
			dateTo.getMonth() -
			dateFrom.getMonth() +
			12 * (dateTo.getFullYear() - dateFrom.getFullYear());

		return diff;
	}

	return (
		<div
			className="flex justify-between w-full p-2 leading-tight bg-gray-100 border-2 border-gray-300 rounded-md shadow cursor-pointer h-fit"
			onClick={() =>
				router.push({
					pathname: "/customer/pawnTicket/[pawnTicketID]",
					query: { pawnTicketID: pawnTicketData.pawnTicketID },
				})
			}
		>
			<div className="flex flex-col justify-between gap-4">
				<div className="flex flex-col text-end w-fit">
					<span className="text-sm font-semibold">{showTransactionType()}</span>
				</div>
				<div className="flex flex-col text-start w-fit">
					<span className="text-[0.9rem] text-gray-400">{showMessage()}</span>
				</div>
			</div>
		</div>
	);
}

export default InboxCard;
