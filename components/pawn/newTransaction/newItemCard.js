import React, { useEffect, useState } from "react";

function NewItemCard({ id, deleteItem, setItem }) {
	const itemTypeList = ["ring", "earring", "watch"];
	const [itemName, setItemName] = useState("");
	const [itemType, setItemType] = useState(itemTypeList[0]);
	const [itemImage, setItemImage] = useState([]);

	useEffect(() => {
		setItem(id, itemName, itemType, itemImage);
		console.log("image is:", itemImage);
	}, [itemName, itemType, itemImage]);

	return (
		<div className="flex gap-5">
			<div className="flex w-full gap-3 p-2 text-sm border-2 border-gray-500 border-solid rounded-md shadow-md bg-light">
				{/* Left side div */}
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
							<option value={itemType} key={itemType}>
								{itemType}
							</option>
						))}
					</select>
					<input
						className="w-full"
						type="file"
						accept="image/*"
						id="itemImage"
						// value={itemImage}
						onChange={(e) => setItemImage(e.target.files[0])}
					></input>
				</div>
			</div>
			<button className="x-button" onClick={() => deleteItem(id)}>
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
		</div>
	);
}

export default NewItemCard;
