import React from "react";

function ItemCategoryDetails({ itemCategory }) {
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
						<input type="number"></input>
						<select></select>
						<select></select>
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
						<select></select>
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
						<select></select>
						<select></select>
						<select></select>
						<select></select>
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
