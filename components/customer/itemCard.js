import React from "react";
import Image from "next/image";

function ItemCard({ item }) {
	return (
		<div
			key={item.itemID}
			className="flex flex-row justify-between p-2 border-2 bg-light"
		>
			<div className="relative object-cover w-[25%] aspect-square border-2 rounded">
				<Image src={item.image} layout="fill"></Image>
			</div>
			<div className="text-[1rem] flex flex-col justify-between text-start">
				<span className="font-semibold">{item.itemName}</span>
				<span>Appraisal Price: Php {item.price.toFixed(2)}</span>
			</div>
		</div>
	);
}

export default ItemCard;
