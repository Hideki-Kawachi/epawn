import Item from "../../../schemas/item";
import dbConnect from "../../../utilities/dbConnect";

export default async function updateItem(req, res) {
	await dbConnect();
	let itemList = JSON.parse(req.body);
	itemList.forEach(async (item) => {
		await Item.findOneAndUpdate(
			{ itemID: item.itemID },
			{
				itemName: item.itemName,
				itemType: item.itemType,
				itemCategory: item.itemCategory,
				price: item.price,
				weight: item.weight,
				color: item.color,
				description: item.description,
				clarity: item.clarity,
				carat: item.carat,
				shape: item.shape,
				quantity: item.quantity,
				purity: item.purity,
				model: item.model,
				brand: item.brand,
			}
		);
	});
	res.json("success");
}
