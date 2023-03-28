import React, { useState } from "react";
import Close from "../closebutton";
import itemTypeList from "../../utilities/dropdownValues/itemType.json";
import ItemCard from "../itemcard";

function AddPawnTicket({
	trigger,
	setTrigger,
	selectedItems,
	pawnTicketList,
	setPawnTicketList,
}) {
	const [selectedPT, setSelectedPT] = useState("new");
	function closeModal() {
		setTrigger(!trigger);
	}

	function addToPawnTicketList() {
		if (selectedPT == "new") {
			setPawnTicketList((pawnTicketList) => [
				...pawnTicketList,
				{ pawnTicketID: pawnTicketList.length + 1, itemList: selectedItems },
			]);
		} else {
			let oldPT;
			let newList = [];
			pawnTicketList.forEach((pt) => {
				if (pt.pawnTicketID == selectedPT) {
					oldPT = pt;
					oldPT.itemList = [...oldPT.itemList, ...selectedItems];
					newList.push(oldPT);
				} else {
					newList.push(pt);
				}
			});
			setPawnTicketList(newList);
			// console.log("NEW PAWN TICKET LIST IS:", newList);
			// console.log("SELECTED ITEM IS:", selectedItems);
		}
		closeModal();
	}

	return (
		<>
			<div id="modal-content-area">
				<div className="px-20 pt-10 pb-10 bg-gray-100 border-2 rounded-xl min-w-fit">
					<div className="ml-[615px] " onClick={() => closeModal()}>
						<Close />
					</div>
					<div className="flex flex-col items-center justify-center gap-4 p-10 text-base font-nunito">
						<h1 className="font-bold">Selected Items:</h1>
						<div className="overflow-y-scroll bg-green-50 max-h-[50vh]">
							{selectedItems.map((item) => (
								<ItemCard key={item.itemID} itemDetails={item}></ItemCard>
							))}
						</div>
						<div className="flex flex-row self-start gap-2">
							<span>Add to PawnTicket:</span>
							<select
								value={selectedPT}
								onChange={(e) => setSelectedPT(e.target.value)}
							>
								<option value={"new"}>New PawnTicket</option>
								{pawnTicketList.map((pt) => (
									<option key={pt.pawnTicketID} value={pt.pawnTicketID}>
										PawnTicket {pt.pawnTicketID}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="flex flex-row justify-end gap-4 text-base">
						<button className="bg-red-300" onClick={() => closeModal()}>
							Cancel
						</button>
						<button
							className="bg-green-300"
							onClick={() => addToPawnTicketList()}
						>
							Add Item
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default AddPawnTicket;
