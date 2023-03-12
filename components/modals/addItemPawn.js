import React, { useState } from "react";
import Close from "../closebutton";
import itemTypeList from "../../utilities/dropdownValues/itemType.json";

function AddItemPawn({ trigger, setTrigger, addItem }) {
	function closeModal() {
		setTrigger(!trigger);
	}
	const [itemName, setItemName] = useState("");
	const [itemType, setItemType] = useState(itemTypeList[0].itemType);
	const [image, setImage] = useState("");

	return (
		<>
			<div id="modal-content-area">
				<div className="px-20 pt-10 pb-10 bg-gray-100 border-2 rounded-xl min-w-fit">
					<div className="ml-[615px] " onClick={() => closeModal()}>
						<Close />
					</div>
					<div className="flex flex-row gap-4 p-10 text-base font-nunito">
						<div className="flex flex-col items-end gap-4">
							<label htmlFor="itemName" className="flex gap-4">
								Name:{" "}
							</label>
							<label htmlFor="itemType" className="flex gap-4">
								Type:
							</label>
							<label htmlFor="itemImage" className="flex gap-4">
								Image:
							</label>
						</div>
						{/* Right side div */}
						<div className="flex flex-col flex-grow gap-3">
							<input
								className="w-full"
								type="text"
								id="itemName"
								value={itemName}
								onChange={(e) => setItemName(e.target.value)}
							></input>
							<select
								className="w-full"
								id="itemType"
								onChange={(e) => setItemType(e.target.value)}
								value={itemType}
							>
								{itemTypeList.map((itemType) => (
									<option value={itemType.itemType} key={itemType.itemType}>
										{itemType.itemType}
									</option>
								))}
							</select>
							<input
								className="w-full"
								type="file"
								accept="image/*"
								id="itemImage"
								//value={image}
								onChange={(e) => setImage(e.target.files[0])}
							></input>
						</div>
					</div>
					<div className="flex flex-row justify-end gap-4 text-base">
						<button className="bg-red-300" onClick={() => closeModal()}>
							Cancel
						</button>
						<button
							className="bg-green-300"
							onClick={() => addItem({ itemName, itemType, image })}
						>
							Add Item
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default AddItemPawn;
