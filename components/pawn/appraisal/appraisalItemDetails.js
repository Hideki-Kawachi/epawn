import React, { useEffect, useState } from "react";
import Image from "next/image";
import ItemTypeData from "../../../utilities/dropdownValues/itemType.json";
import ItemCategoryData from "../../../utilities/dropdownValues/itemCategory.json";
import ItemCategoryDetails from "./itemCategoryDetails";

function AppraisalItemsDetails({ itemDetails, setItemDetails }) {
	const itemTypeList = ItemTypeData;
	const itemCategoryList = ItemCategoryData;
	const [itemName, setItemName] = useState("");
	const [itemType, setItemType] = useState("");
	const [itemCategory, setItemCategory] = useState("");
	const [price, setPrice] = useState(0);
	const [priceShow, setPriceShow] = useState("0");

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
			setPrice(parseInt(newString));
			setPriceShow(parseInt(newString).toLocaleString("en-US"));
		} else if (price < 9) {
			setPrice(0);
			setPriceShow("0");
		}
	}

	function isDigit(value) {
		return /^-?\d+$/.test(value);
	}

	useEffect(() => {
		if (itemDetails) {
			if (itemDetails.itemCategory.length == 0) {
				setItemCategory("Gold");
			} else {
				setItemCategory(itemDetails.itemCategory);
			}

			setItemName(itemDetails.itemName);
			setItemType(itemDetails.itemType);
			setPrice(itemDetails.price);
			setPriceShow(itemDetails.price);
		}
		// console.log("item Details are:", itemDetails);
	}, [itemDetails]);

	useEffect(() => {
		if (itemDetails) {
			let updatedItem = Object.assign(itemDetails, {
				itemName: itemName,
				itemType: itemType,
				price: price,
				itemCategory: itemCategory,
			});
			// console.log("SET", itemDetails);
			// console.log("WRONG", itemName, itemType, price);
			setItemDetails(updatedItem);
		}
	}, [itemName, price, itemType, itemCategory]);

	// useEffect(()=>{
	// 	setItemDetails({})
	// },[itemCategory])

	return (
		<>
			{itemDetails ? (
				<div className="border-2 bg-gray-150">
					<div className="flex flex-row w-full gap-2 p-4 ">
						<div className="flex flex-col items-end gap-4 font-semibold">
							<span>Name:*</span>
							<span>Type:*</span>
							<span>Price:*</span>
							<span>Category:*</span>
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
								id="price"
								required
								value={priceShow}
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
					<hr className="border-2"></hr>
					<ItemCategoryDetails
						itemCategory={itemCategory}
						itemDetails={itemDetails}
						setItemDetails={setItemDetails}
					></ItemCategoryDetails>
				</div>
			) : (
				<></>
			)}
		</>
	);
}

export default AppraisalItemsDetails;
