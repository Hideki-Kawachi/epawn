import mongoose from "mongoose";
import Transaction from "../../../schemas/transaction";
import dbConnect from "../../../utilities/dbConnect";

export default async function UpdateTransactionStatus(req, res) {
	let body = JSON.parse(req.body);
	await dbConnect();

	let result = await Transaction.findByIdAndUpdate(
		new mongoose.Types.ObjectId(body.transactionID),
		{ status: body.status }
	);

	if (result) {
		res.json("success");
	} else {
		res.json("error");
	}
}
