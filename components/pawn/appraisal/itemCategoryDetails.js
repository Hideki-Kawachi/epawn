import React, { useEffect, useState } from "react";
import GoldColorValues from "../,,/../../../utilities/dropdownValues/goldColor.json";
import GoldPurityValues from "../,,/../../../utilities/dropdownValues/goldPurity.json";
import PlatinumPurityValues from "../,,/../../../utilities/dropdownValues/platinumPurity.json";
import DiamondClarityValues from "../,,/../../../utilities/dropdownValues/diamondClarity.json";
import DiamondColorValues from "../,,/../../../utilities/dropdownValues/diamondColor.json";
import DiamondShapeValues from "../,,/../../../utilities/dropdownValues/diamondShape.json";

function ItemCategoryDetails({ itemCategory, itemDetails, setItemDetails }) {
	const [addItemDetails, setAddItemDetails] = useState({});
	const [weight, setWeight] = useState(0);
	const [quantity, setQuantity] = useState(0);
	const [color, setColor] = useState("");
	const [purity, setPurity] = useState("");
	const [brand, setBrand] = useState("");
	const [model, setModel] = useState("");
	const [description, setDescription] = useState("");
	const [clarity, setClarity] = useState("");
	const [carat, setCarat] = useState(0);
	const [shape, setShape] = useState("");

	function getWeight(weightInput) {
		let numTest = /^\d+(\.\d{1,2})?$/;
		if (Number.isNaN(weightInput)) {
			console.log("NAN");
			setWeight(0);
		} else if (weightInput > 0) {
			setWeight(parseInt(weightInput));
		} else if (weightInput == 0) {
			setWeight(0);
		}
	}

	useEffect(() => {
		console.log("weight is:", typeof weight);
	}, [weight]);

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
							typeof="Number"
							onChange={(e) => getWeight(e.target.value)}
							value={weight}
						></input>
						<select>
							{GoldColorValues.map((value) => (
								<option key={value.goldColor} value={value.goldColor}>
									{value.goldColor}
								</option>
							))}
						</select>
						<select>
							{GoldPurityValues.map((value) => (
								<option key={value.goldPurity} value={value.goldPurity}>
									{value.goldPurity}
								</option>
							))}
						</select>
						<input type="text"></input>
						<input type="text"></input>
						<input type="text"></input>
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
						<input type="number"></input>
						<select>
							{PlatinumPurityValues.map((value) => (
								<option key={value.platinumPurity} value={value.platinumPurity}>
									{value.platinumPurity}
								</option>
							))}
						</select>
						<input type="text"></input>
						<input type="text"></input>
						<input type="text"></input>
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
						<input type="number"></input>
						<select>
							{DiamondClarityValues.map((value) => (
								<option key={value.diamondClarity} value={value.diamondClarity}>
									{value.diamondClarity}
								</option>
							))}
						</select>
						<select>
							{DiamondColorValues.map((value) => (
								<option key={value.diamondColor} value={value.diamondColor}>
									{value.diamondColor}
								</option>
							))}
						</select>
						<input type="number"></input>
						<select>
							{DiamondShapeValues.map((value) => (
								<option key={value.diamondShape} value={value.diamondShape}>
									{value.diamondShape}
								</option>
							))}
						</select>
						<input type="number"></input>
						<input type="text"></input>
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
						<input type="number"></input>
						<input type="text"></input>
						<input type="text"></input>
						<input type="text"></input>
					</div>
				</div>
			</>
		),
	};

	return <>{showCategory[itemCategory]}</>;
}

export default ItemCategoryDetails;
