import PriceHistory from "../../../schemas/priceHistory";

export default async function NewAskPrice(req, res) {
	let body = JSON.parse(req.body);

	console.log("BODY IS:", body);

	let result = PriceHistory.create({
		transactionID: body.transactionID,
		askPrice: body.askPrice,
		appraisalPrice: body.appraisalPrice,
	});

	if (result) {
		res.json("success");
	} else {
		res.json("error");
	}
}
