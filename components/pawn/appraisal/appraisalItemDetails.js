import React, { useEffect, useState } from "react";
import Image from "next/image";
import ItemTypeData from "../../tempData/itemType.json";
import ItemCategoryData from "../../tempData/itemCategory.json";

function AppraisalItemsDetails({ itemDetails, setItemDetails }) {
	const itemTypeList = ItemTypeData;
	const itemCategoryList = ItemCategoryData;
	const [itemName, setItemName] = useState("");
	const [itemType, setItemType] = useState("");
	const [itemCategory, setItemCategory] = useState("");
	const [itemPrice, setItemPrice] = useState(0);
	const [itemPriceShow, setItemPriceShow] = useState("0");

	function convertPrice(value) {
		let newString = "";

		if (isDigit(value.charAt(value.length - 1))) {
			if (value.includes(",")) {
				let subValues = value.split(",");

				subValues.forEach((subValue) => {
					newString += subValue;
				});
			} else {
				newString = value;
			}
			setItemPrice(parseInt(newString));
			setItemPriceShow(parseInt(newString).toLocaleString("en-US"));
		} else if (itemPrice < 9) {
			setItemPrice(0);
			setItemPriceShow("0");
		}
	}

	function isDigit(value) {
		return /^-?\d+$/.test(value);
	}

	useEffect(() => {
		if (itemDetails) {
			setItemName(itemDetails.itemName);
			setItemType(itemDetails.itemType);
		}
	}, [itemDetails]);

	useEffect(() => {
		if (itemDetails) {
			let updatedItem = {
				itemID: itemDetails.itemID,
				itemName: itemName,
				itemType: itemType,
				itemPrice: itemPrice,
			};
			setItemDetails(updatedItem);
		}
	}, [itemName, itemPrice, itemType]);

	return (
		<>
			{itemDetails ? (
				<div className="flex flex-row w-full gap-2 p-4 border-2 bg-gray-150">
					<div className="flex flex-col items-end gap-4 font-semibold">
						<span>Name:</span>
						<span>Type:</span>
						<span>Price:</span>
						<span>Category:</span>
					</div>
					<div className="flex flex-col w-full gap-3">
						<input
							type="text"
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
							type="text"
							id="itemPrice"
							required
							value={itemPriceShow}
							onChange={(e) => convertPrice(e.target.value)}
						></input>
						<select
							className="w-full"
							id="itemType"
							onChange={(e) => setItemCategory(e.target.value)}
							value={itemCategory}
						>
							{itemCategoryList.map((itemCategory) => (
								<option
									value={itemCategory.itemCategory}
									key={itemCategory.itemCategory}
								>
									{itemCategory.itemCategory}
								</option>
							))}
						</select>
					</div>
				</div>
			) : (
				<></>
			)}
		</>
	);
}

export default AppraisalItemsDetails;
