import Item from "../../../schemas/item";
import dbConnect from "../../../utilities/dbConnect";

export default async function RemoveItem(req, res) {
	await dbConnect();
	let itemList = JSON.parse(req.body);
	console.log("ITEM LIST IS:", itemList);

	let result;
	itemList.map(async (item) => {
		console.log("ITEM IS:", item);
		result = await Item.deleteOne({ itemID: item.itemID });
		console.log("result is:", result);
	});

	res.json("success");
}
