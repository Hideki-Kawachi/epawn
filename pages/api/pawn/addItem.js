import Item from "../../../schemas/item";
import dbConnect from "../../../utilities/dbConnect";
import generateItemID from "../../../utilities/generateItemID";

export default async function AddItem(req, res) {
	await dbConnect();
	let body = JSON.parse(req.body);
	let itemData = body.itemData;
	let itemListID = body.itemListID;

	let latestItem = await Item.find({}).sort({ itemID: -1 }).limit(1);

	let itemID = "AA-000000";
	console.log("latest item is:", latestItem);

	if (latestItem.length > 0) {
		itemID = generateItemID(latestItem[0].itemID);
	}

	let itemCreate = [];

	itemData.map((item) => {
		itemCreate.push({
			itemID: itemID,
			itemListID: itemListID,
			itemName: item.name,
			itemType: item.type,
			image: item.image,
			itemCategory: "",
			price: 0,
			weight: 0,
			brand: "",
			model: "",
			color: "",
			clarity: "",
			purity: "",
			carat: 0,
			shape: "",
			quantity: 0,
			description: "",
			forAuction: false,
			isRedeemed: false,
			redeemID: "",
		});
		itemID = generateItemID(itemID);
	});

	let items = await Item.insertMany(itemCreate);

	if (items) {
		res.json("success");
	} else {
		res.json("error");
	}
}
