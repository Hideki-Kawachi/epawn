import mongoose from "mongoose";
import PriceHistory from "../../../schemas/priceHistory";
import dbConnect from "../../../utilities/dbConnect";

export default async function NewAppraisalPrice(req, res) {
	await dbConnect();
	let body = JSON.parse(req.body);

	console.log("BODY IS:", body);

	let result = await PriceHistory.findByIdAndUpdate(
		new mongoose.Types.ObjectId(body.priceHistoryID),
		{ appraisalPrice: body.appraisalPrice }
	);

	console.log("RESULT IS:", result);

	if (result) {
		res.json("success");
	} else {
		res.json("error");
	}
}
