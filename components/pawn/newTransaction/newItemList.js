import React, { useEffect, useState } from "react";
import NewItemCard from "./newItemCard";

function NewItemList({ itemList, setItemList }) {
	function deleteItem(id) {
		let newList = itemList.filter((items) => {
			return items.id != id;
		});
		setItemList(newList);
	}

	function setItem(id, name, type, image) {
		let newList = itemList.map((item) => {
			if (item.id == id) {
				item.name = name;
				item.type = type;
				item.image = image;
			}
			return item;
		});
		setItemList(newList);
	}

	return (
		<div className="w-full bg-white h-[50vh] border-gray-500 border-solid border-2 overflow-y-scroll gap-3 flex flex-col">
			{itemList.map((items) => (
				<NewItemCard
					key={items.id}
					id={items.id}
					deleteItem={deleteItem}
					setItem={setItem}
				></NewItemCard>
			))}
		</div>
	);
}

export default NewItemList;
