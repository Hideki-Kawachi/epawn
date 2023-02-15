import React, { useEffect, useState } from "react";
import NewItemCard from "./newItemCard";

function NewItemList({ itemList, setItemList }) {
	function deleteItem(id) {
		let newList = itemList.filter((items) => {
			return items.id != id;
		});
		setItemList(newList);
	}

	return (
		<div className="w-full bg-green-100 h-[50vh] border-gray-500 border-solid border-2 p-4 overflow-y-scroll gap-3 flex flex-col">
			{itemList.map((items) => (
				<NewItemCard
					key={items.id}
					id={items.id}
					deleteItem={deleteItem}
				></NewItemCard>
			))}
		</div>
	);
}

export default NewItemList;
