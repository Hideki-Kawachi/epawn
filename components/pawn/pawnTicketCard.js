import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import ViewPawnTicketDetails from "../modals/viewPawnTicketDetails";

function PawnTicketCard({ itemList, pawnTicketID, deletePawnTicket }) {
	const [loanAmount, setLoanAmount] = useState(0);
	const [netProceeds, setNetProceeds] = useState("");
	const [advInterest, setAdvInterest] = useState("");
	const [detaislModal, setDetailsModal] = useState(false);

	useEffect(() => {
		let sum = 0;
		itemList.forEach((item) => {
			sum += item.price;
		});
		setLoanAmount(sum);
	}, [itemList]);

	useEffect(() => {
		let tempAdvInterest = loanAmount * 0.035;
		setAdvInterest(tempAdvInterest.toFixed(2));
		setNetProceeds((loanAmount - tempAdvInterest).toFixed(2));
	}, [loanAmount]);

	return (
		<>
			<Modal isOpen={detaislModal} ariaHideApp={false} className="modal">
				<ViewPawnTicketDetails
					trigger={detaislModal}
					setTrigger={setDetailsModal}
					itemList={itemList}
					loanAmount={loanAmount}
					netProceeds={netProceeds}
					advInterest={advInterest}
					pawnTicketID={pawnTicketID}
				/>
			</Modal>
			<div className="flex flex-row justify-between p-5 text-sm rounded bg-light font-nunito">
				<div className="flex flex-col ">
					<span className="font-bold">PawnTicket {pawnTicketID}</span>
					<div className="flex flex-row gap-4">
						<div className="flex flex-col text-right whitespace-nowrap">
							<span>Loan Amount:</span>
							<span>Net Proceeds:</span>
							<span>Item Count:</span>
						</div>
						<div className="flex flex-col text-end whitespace-nowrap">
							<span>Php {loanAmount.toFixed(2)}</span>
							<span>Php {netProceeds}</span>
							<span className="text-start">{itemList.length}</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-end justify-between">
					{typeof deletePawnTicket == "function" ? (
						<button
							className="x-button"
							onClick={() => deletePawnTicket(pawnTicketID)}
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 14 14"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M9.16711 6.29289C8.77658 6.68342 8.77658 7.31658 9.16711 7.70711L13.7071 12.2471C13.8946 12.4346 14 12.689 14 12.9542V13C14 13.5523 13.5523 14 13 14H12.9542C12.689 14 12.4346 13.8946 12.2471 13.7071L7.70711 9.16711C7.31658 8.77658 6.68342 8.77658 6.29289 9.16711L1.75289 13.7071C1.56536 13.8946 1.311 14 1.04579 14H1C0.447716 14 0 13.5523 0 13V12.9542C0 12.689 0.105357 12.4346 0.292893 12.2471L4.83289 7.70711C5.22342 7.31658 5.22342 6.68342 4.83289 6.29289L0.292893 1.75289C0.105357 1.56536 0 1.311 0 1.04579V1C0 0.447716 0.447716 0 1 0H1.04579C1.311 0 1.56536 0.105357 1.75289 0.292893L6.29289 4.83289C6.68342 5.22342 7.31658 5.22342 7.70711 4.83289L12.2471 0.292893C12.4346 0.105357 12.689 0 12.9542 0H13C13.5523 0 14 0.447716 14 1V1.04579C14 1.311 13.8946 1.56536 13.7071 1.75289L9.16711 6.29289Z"
									fill="red"
								/>
							</svg>
						</button>
					) : (
						<></>
					)}

					<button
						className="bg-green-300"
						onClick={() => setDetailsModal(true)}
					>
						View Details
					</button>
				</div>
			</div>
		</>
	);
}

export default PawnTicketCard;
