import mongoose from "mongoose";
import Item from "../../../schemas/item";
import PriceHistory from "../../../schemas/priceHistory";
import Transaction from "../../../schemas/transaction";
import dbConnect from "../../../utilities/dbConnect";

export default async function ItemAppraisal(req, res) {
	let body = JSON.parse(req.body);
	let itemList = body.itemList;
	let itemListID = body.itemList[0].itemListID;
	let appraisalPrice = body.appraisalPrice;
	let transactionID = body.transactionID;
	console.log("item list:", itemList);
	console.log("item list ID:", itemListID);
	console.log("appraisal price:", appraisalPrice);
	console.log("transactionID:", transactionID);

	await dbConnect();

	let transaction = await Transaction.findByIdAndUpdate(
		new mongoose.Types.ObjectId(transactionID),
		{ status: "appraised" }
	);
	let priceHistory = await PriceHistory.findOneAndUpdate(
		{ transactionID: transactionID, sort: { createdAt: -1 } },
		{ appraisalPrice: appraisalPrice }
	);
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

	if (priceHistory && transaction) {
		res.json("success");
	} else {
		res.json("error");
	}
}
