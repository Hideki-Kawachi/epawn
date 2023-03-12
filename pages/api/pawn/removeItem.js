import Item from "../../../schemas/item";
import dbConnect from "../../../utilities/dbConnect";

export default async function RemoveItem(req, res) {
	let itemList = JSON.parse(req.body);
	console.log("item list:", itemList);

	await dbConnect();
	let result;
	itemList.map(async (item) => {
		result = await Item.deleteOne({ itemID: item.itemID });
		console.log("result is:", result);
	});

	res.json("success");
}
