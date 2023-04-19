import React from "react";
import Close from "../closebutton";
import ItemCard from "../itemcard";

function ViewPawnTicketDetails({
	itemList,
	trigger,
	setTrigger,
	loanAmount,
	netProceeds,
	advInterest,
	pawnTicketID,
}) {
	function closeModal() {
		setTrigger(!trigger);
	}

	function convertFloat(number) {
      return Number(number).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

	return (
		<>
			<div id="modal-content-area">
				<div className="px-20 pt-10 pb-10 bg-gray-100 border-2 rounded-xl min-w-fit">
					<div className="ml-[615px] " onClick={() => closeModal()}>
						<Close />
					</div>
					<div className="flex flex-col items-center justify-center gap-2 p-10 text-sm font-nunito">
						<span className="w-full font-bold text-start">
							PawnTicket {pawnTicketID}
						</span>
						<div className="flex flex-row justify-start w-full gap-4 ml-10">
							<div className="flex flex-col text-right whitespace-nowrap">
								<span>Loan Amount:</span>
								<span>Adv. Interest:</span>
								<span className="font-bold">Net Proceeds:</span>
							</div>
							<div className="flex flex-col text-end whitespace-nowrap">
								<span>Php {convertFloat(loanAmount)}</span>
								<span>Php {convertFloat(advInterest)}</span>
								<hr></hr>
								<span className="font-bold">Php {convertFloat(netProceeds)}</span>
							</div>
						</div>
						<h1 className="w-full mt-3 font-bold text-start">Item List:</h1>
						<div className="overflow-y-scroll bg-green-50 max-h-[50vh]">
							{itemList.map((item) => (
								<ItemCard key={item.itemID} itemDetails={item}></ItemCard>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default ViewPawnTicketDetails;
