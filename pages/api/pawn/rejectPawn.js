import Transaction from "../../../schemas/transaction";
import dbConnect from "../../../utilities/dbConnect";

export default async function RejectPawn(req, res) {
	await dbConnect();

	let body = JSON.parse(req.body);
	let result = await Transaction.findByIdAndUpdate(body.transactionID, {
		rejectionMessage: body.rejectionMessage,
		status: "Rejected",
	});

	console.log("RESULT FROM REJECT IS:", result);
	res.json("success");
}
