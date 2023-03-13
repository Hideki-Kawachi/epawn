import React, { useEffect, useState } from "react";
import GoldColorValues from "../,,/../../../utilities/dropdownValues/goldColor.json";
import GoldPurityValues from "../,,/../../../utilities/dropdownValues/goldPurity.json";
import PlatinumPurityValues from "../,,/../../../utilities/dropdownValues/platinumPurity.json";
import DiamondClarityValues from "../,,/../../../utilities/dropdownValues/diamondClarity.json";
import DiamondColorValues from "../,,/../../../utilities/dropdownValues/diamondColor.json";
import DiamondShapeValues from "../,,/../../../utilities/dropdownValues/diamondShape.json";

function ItemCategoryDetails({ itemCategory, itemDetails, setItemDetails }) {
	const [weight, setWeight] = useState("0");
	const [quantity, setQuantity] = useState(0);
	const [color, setColor] = useState("");
	const [purity, setPurity] = useState("");
	const [brand, setBrand] = useState("");
	const [model, setModel] = useState("");
	const [description, setDescription] = useState("");
	const [clarity, setClarity] = useState("");
	const [carat, setCarat] = useState("0");
	const [shape, setShape] = useState("");

	useEffect(() => {
		setWeight(itemDetails.weight ? itemDetails.weight.toString() : "0");
		setQuantity(itemDetails.quantity ? itemDetails.quantity : 0);
		if (itemCategory == "Gold") {
			setColor(
				GoldColorValues.includes({ goldColor: itemDetails.color })
					? itemDetails.color
					: "Rose"
			);
			setPurity(
				GoldPurityValues.includes({ goldPurity: itemDetails.purity })
					? itemDetails.purity
					: "24K"
			);
		} else if (itemCategory == "Platinum") {
			setPurity(
				PlatinumPurityValues.includes({ platinumPurity: itemDetails.purity })
					? itemDetails.purity
					: "999"
			);
		} else if (itemCategory == "Diamond") {
			setColor(
				DiamondColorValues.includes({ diamondColor: itemDetails.color })
					? itemDetails.color
					: "Colorless"
			);
			setClarity(itemDetails.clarity ? itemDetails.clarity : "Flawless");
			setCarat(itemDetails.carat ? itemDetails.carat : "0");
			setShape(itemDetails.shape ? itemDetails.shape : "Round");
		}
		setBrand(itemDetails.brand ? itemDetails.brand : "");
		setModel(itemDetails.model ? itemDetails.model : "");
		setDescription(itemDetails.description ? itemDetails.description : "");
	}, [itemCategory, itemDetails]);

	useEffect(() => {
		let NewItemDetails;
		let newWeight;
		if (isNaN(parseFloat(weight))) {
			newWeight = "0";
		} else {
			newWeight = weight;
		}

		if (itemCategory == "Gold") {
			delete itemDetails.quantity;
			delete itemDetails.shape;
			delete itemDetails.carat;
			delete itemDetails.clarity;
			NewItemDetails = Object.assign(itemDetails, {
				itemCategory: itemCategory,
				weight: parseFloat(newWeight),
				color: color,
				purity: purity,
				brand: brand,
				model: model,
				description: description,
				quantity: 0,
				shape: "",
				carat: 0,
				clarity: "",
			});
		} else if (itemCategory == "Platinum") {
			delete itemDetails.color;
			delete itemDetails.quantity;
			delete itemDetails.shape;
			delete itemDetails.carat;
			delete itemDetails.clarity;
			NewItemDetails = Object.assign(itemDetails, {
				itemCategory: itemCategory,
				weight: parseFloat(newWeight),
				purity: purity,
				brand: brand,
				model: model,
				description: description,
				color: "",
				quantity: 0,
				shape: "",
				carat: 0,
				clarity: "",
			});
		} else if (itemCategory == "Diamond") {
			delete itemDetails.purity;
			delete itemDetails.model;
			delete itemDetails.brand;
			let newCarat;
			if (isNaN(parseFloat(carat))) {
				newCarat = "0";
			} else {
				newCarat = carat;
			}

			NewItemDetails = Object.assign(itemDetails, {
				itemCategory: itemCategory,
				weight: parseFloat(newWeight),
				clarity: clarity,
				color: color,
				carat: parseFloat(newCarat),
				shape: shape,
				quantity: quantity,
				description: description,
				purity: "",
				model: "",
				brand: "",
			});
		} else {
			delete itemDetails.purity;
			delete itemDetails.quantity;
			delete itemDetails.shape;
			delete itemDetails.carat;
			delete itemDetails.color;
			delete itemDetails.clarity;
			NewItemDetails = Object.assign(itemDetails, {
				itemCategory: itemCategory,
				weight: parseFloat(newWeight),
				brand: brand,
				model: model,
				description: description,
				purity: "",
				quantity: 0,
				shape: "",
				carat: 0,
				color: "",
				clarity: "",
			});
		}
		// console.log("new item details:", NewItemDetails);
	}, [
		weight,
		quantity,
		color,
		purity,
		brand,
		model,
		description,
		clarity,
		carat,
		shape,
	]);

	function weightInsert(value) {
		if (isNaN(parseFloat(weight)) && isNaN(value)) {
			setWeight("0");
		} else if (!value || value.match(/^\d{1,}(\.\d{0,2})?$/)) {
			setWeight(value);
		}
	}

	function caratInsert(value) {
		if (!value || value.match(/^\d{1,}(\.\d{0,2})?$/)) {
			setCarat(value);
		} else if (carat == "") {
			setWeight("0");
		}
	}

	const showCategory = {
		Gold: (
			<>
				<div className="flex flex-row w-full gap-2 p-4 ">
					<div className="flex flex-col items-end gap-4 font-semibold">
						<span>Weight:*</span>
						<span>Color:*</span>
						<span>Purity:*</span>
						<span>Brand:</span>
						<span>Model:</span>
						<span>Description:</span>
					</div>
					<div className="flex flex-col w-full gap-3">
						<input
							type="Number"
							onChange={(e) => weightInsert(e.target.value)}
							value={parseFloat(weight)}
						></input>
						<select value={color} onChange={(e) => setColor(e.target.value)}>
							{GoldColorValues.map((value) => (
								<option key={value.goldColor} value={value.goldColor}>
									{value.goldColor}
								</option>
							))}
						</select>
						<select value={purity} onChange={(e) => setPurity(e.target.value)}>
							{GoldPurityValues.map((value) => (
								<option key={value.goldPurity} value={value.goldPurity}>
									{value.goldPurity}
								</option>
							))}
						</select>
						<input
							type="text"
							value={brand}
							onChange={(e) => setBrand(e.target.value)}
						></input>
						<input
							type="text"
							value={model}
							onChange={(e) => setModel(e.target.value)}
						></input>
						<input
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						></input>
					</div>
				</div>
			</>
		),
		Platinum: (
			<>
				<div className="flex flex-row w-full gap-2 p-4 ">
					<div className="flex flex-col items-end gap-4 font-semibold">
						<span>Weight:*</span>
						<span>Purity:*</span>
						<span>Brand:</span>
						<span>Model:</span>
						<span>Description:</span>
					</div>
					<div className="flex flex-col w-full gap-3">
						<input
							type="number"
							onChange={(e) => weightInsert(e.target.value)}
							value={parseFloat(weight)}
						></input>
						<select>
							{PlatinumPurityValues.map((value) => (
								<option key={value.platinumPurity} value={value.platinumPurity}>
									{value.platinumPurity}
								</option>
							))}
						</select>
						<input
							type="text"
							value={brand}
							onChange={(e) => setBrand(e.target.value)}
						></input>
						<input
							type="text"
							value={model}
							onChange={(e) => setModel(e.target.value)}
						></input>
						<input
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						></input>
					</div>
				</div>
			</>
		),
		Diamond: (
			<>
				<div className="flex flex-row w-full gap-2 p-4 ">
					<div className="flex flex-col items-end gap-4 font-semibold">
						<span>Weight:*</span>
						<span>Clarity:*</span>
						<span>Color:*</span>
						<span>Carat:*</span>
						<span>Shape:*</span>
						<span>Quantity:*</span>
						<span>Description:</span>
					</div>
					<div className="flex flex-col w-full gap-3">
						<input
							type="number"
							onChange={(e) => weightInsert(e.target.value)}
							value={parseFloat(weight)}
						></input>
						<select
							onChange={(e) => setClarity(e.target.value)}
							value={clarity}
						>
							{DiamondClarityValues.map((value) => (
								<option key={value.diamondClarity} value={value.diamondClarity}>
									{value.diamondClarity}
								</option>
							))}
						</select>
						<select onChange={(e) => setColor(e.target.value)} value={color}>
							{DiamondColorValues.map((value) => (
								<option key={value.diamondColor} value={value.diamondColor}>
									{value.diamondColor}
								</option>
							))}
						</select>
						<input
							type="number"
							onChange={(e) => caratInsert(e.target.value)}
							value={parseFloat(carat)}
						></input>
						<select onChange={(e) => setShape(e.target.value)} value={shape}>
							{DiamondShapeValues.map((value) => (
								<option key={value.diamondShape} value={value.diamondShape}>
									{value.diamondShape}
								</option>
							))}
						</select>
						<input
							type="number"
							onChange={(e) => setQuantity(parseInt(e.target.value))}
							value={isNaN(quantity) ? 0 : quantity}
						></input>
						<input
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						></input>
					</div>
				</div>
			</>
		),
		Others: (
			<>
				<div className="flex flex-row w-full gap-2 p-4 ">
					<div className="flex flex-col items-end gap-4 font-semibold">
						<span>Weight:*</span>
						<span>Brand:</span>
						<span>Model:</span>
						<span>Description:*</span>
					</div>
					<div className="flex flex-col w-full gap-3">
						<input
							type="number"
							onChange={(e) => weightInsert(e.target.value)}
							value={parseFloat(weight)}
						></input>
						<input
							type="text"
							value={brand}
							onChange={(e) => setBrand(e.target.value)}
						></input>
						<input
							type="text"
							value={model}
							onChange={(e) => setModel(e.target.value)}
						></input>
						<input
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						></input>
					</div>
				</div>
			</>
		),
	};

	return <>{showCategory[itemCategory]}</>;
}

export default ItemCategoryDetails;
