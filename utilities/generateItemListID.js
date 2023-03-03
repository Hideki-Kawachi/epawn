import ItemList from "../schemas/itemList";

export default async function generateItemListID() {
	//must have dbConnect before calling
	let latestItemList = await ItemList.find({})
		.sort({ itemListID: -1 })
		.limit(1);

	if (latestItemList.length == 0) {
		return 0;
	} else {
		return latestItemList[0].itemListID + 1;
	}
}
