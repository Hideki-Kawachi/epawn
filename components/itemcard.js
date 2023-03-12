import React, { useState } from "react";
import Modal from "react-modal";
import PawnDetails from "./modals/pawnDetails";
function ItemCard({ itemID, itemName, itemType, itemPrice }) {
	const [pawnModal, setPawnOpen] = useState(false); //View Pawn Item Detials

	function viewDetails() {
		setPawnOpen(true);
	}

	function convertFloat(number) {
		return Number(number).toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	return (
		<div className="flex justify-between m-5 rounded-lg shadow-md bg-light font-nunito h-fit">
			<Modal isOpen={pawnModal} ariaHideApp={false} className="modal">
				<PawnDetails
					trigger={pawnModal}
					setTrigger={setPawnOpen}
					itemName={itemName}
					itemType={itemType}
					itemPrice={convertFloat(itemPrice)}
					itemID={itemID}
				/>
			</Modal>

			<div className="m-5 w-96">
				<p>
					<b>Name: </b>
					{itemName}
				</p>
				<p>
					<b>ID: </b>
					{itemID}
				</p>
				<p>
					<b>Type: </b>
					{itemType}
				</p>
				<p>
					<b>Price: </b>
					Php {convertFloat(itemPrice)}
				</p>
			</div>
			<div className="relative right-5 top-5">
				<button className="text-white bg-green-300" onClick={viewDetails}>
					View Details
				</button>
			</div>
		</div>
	);
}

export default ItemCard;
