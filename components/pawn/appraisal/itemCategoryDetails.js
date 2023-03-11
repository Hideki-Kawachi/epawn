import React, { useEffect, useState } from "react";
import GoldColorValues from "../,,/../../../utilities/dropdownValues/goldColor.json";
import GoldPurityValues from "../,,/../../../utilities/dropdownValues/goldPurity.json";
import PlatinumPurityValues from "../,,/../../../utilities/dropdownValues/platinumPurity.json";
import DiamondClarityValues from "../,,/../../../utilities/dropdownValues/diamondClarity.json";
import DiamondColorValues from "../,,/../../../utilities/dropdownValues/diamondColor.json";
import DiamondShapeValues from "../,,/../../../utilities/dropdownValues/diamondShape.json";

function ItemCategoryDetails({ itemCategory, itemDetails, setItemDetails }) {
	const [addItemDetails, setAddItemDetails] = useState({});
	const [weight, setWeight] = useState("");
	const [quantity, setQuantity] = useState(0);
	const [color, setColor] = useState("");
	const [purity, setPurity] = useState("");
	const [brand, setBrand] = useState("");
	const [model, setModel] = useState("");
	const [description, setDescription] = useState("");
	const [clarity, setClarity] = useState("");
	const [carat, setCarat] = useState("");
	const [shape, setShape] = useState("");

	// useEffect(() => {
	// 	if (isNaN(weight)) {
	// 		setWeight(0);
	// 	}
	// }, [weight]);

	useEffect(() => {
		setWeight("");
		setQuantity(0);
		setColor("");
		setPurity("");
		setBrand("");
		setModel("");
		setDescription("");
		setClarity("");
		setCarat("");
		setShape("");
	}, [itemCategory]);

	useEffect(() => {
		let NewItemDetails;

		if (itemCategory == "Gold") {
			delete itemDetails.quantity;
			delete itemDetails.shape;
			delete itemDetails.carat;
			delete itemDetails.clarity;
			NewItemDetails = Object.assign(itemDetails, {
				itemCategory: itemCategory,
				weight: parseFloat(weight),
				color: color,
				purity: purity,
				brand: brand,
				model: model,
				description: description,
			});
		} else if (itemCategory == "Platinum") {
			delete itemDetails.color;
			delete itemDetails.quantity;
			delete itemDetails.shape;
			delete itemDetails.carat;
			delete itemDetails.clarity;
			NewItemDetails = Object.assign(itemDetails, {
				itemCategory: itemCategory,
				weight: parseFloat(weight),
				purity: purity,
				brand: brand,
				model: model,
				description: description,
			});
		} else if (itemCategory == "Diamond") {
			delete itemDetails.purity;
			delete itemDetails.model;
			delete itemDetails.brand;
			NewItemDetails = Object.assign(itemDetails, {
				itemCategory: itemCategory,
				weight: parseFloat(weight),
				clarity: clarity,
				color: color,
				carat: carat,
				shape: shape,
				quantity: quantity,
				description: description,
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
				weight: parseFloat(weight),
				brand: brand,
				model: model,
				description: description,
			});
		}
		console.log("new item details:", NewItemDetails);
		setItemDetails(NewItemDetails);
	}, [
		itemCategory,
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
		if (!value || value.match(/^\d{1,}(\.\d{0,2})?$/)) {
			setWeight(value);
		}
	}

	function caratInsert(value) {
		if (!value || value.match(/^\d{1,}(\.\d{0,2})?$/)) {
			setCarat(value);
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
