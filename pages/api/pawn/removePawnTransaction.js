import mongoose from "mongoose";
import Item from "../../../schemas/item";
import ItemList from "../../../schemas/itemList";
import PriceHistory from "../../../schemas/priceHistory";
import Transaction from "../../../schemas/transaction";
import CustomerInfo from "../../../schemas/customerInfo";
import User from "../../../schemas/user";
import dbConnect from "../../../utilities/dbConnect";

export default async function RemovePawnTransaction(req, res) {
	await dbConnect();

	let body = JSON.parse(req.body);
	let transactionID = body.transactionID;
	let itemListID = body.itemListID;
	let customerID = body.customerID;
	let transactionRes = await Transaction.findByIdAndDelete(
		new mongoose.Types.ObjectId(transactionID)
	);
	let itemRes = await Item.deleteMany({ itemListID: itemListID });
	let itemListRes = await ItemList.deleteOne({ itemListID: itemListID });
	let isReturning = await CustomerInfo.exists({ userID: customerID });
	if (!isReturning) {
		let userRes = await User.deleteOne({ userID: customerID });
	}
	let priceHistoryRes = await PriceHistory.deleteMany({
		transactionID: transactionID,
	});

	res.json("success");
}
