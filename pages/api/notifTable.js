import mongoose from "mongoose";
import Transaction from "../../schemas/transaction";
import dbConnect from "../../utilities/dbConnect";

export default async function NotifTable(req, res) {
	await dbConnect();

	let all = null;

	const changeStream = await Transaction.watch().on("change", async (data) => {
		// console.log("hahu");
		all = await Transaction.find({});
		console.log("all", all);

		if (all) {
			// console.log("ALL IS:", all);
			await changeStream.close();
			res.json(all);
		} else {
			// console.log("NER", all);
		}
	});

	// if (req.session.userData.role == "clerk") {
	// 	transactionData = await Transaction.find({
	// 		branchID: branchData.branchID,
	// 		clerkID: req.session.userData.userID,
	// 		isDisabled: false,
	// 		status: { $ne: "Done" },
	// 	}).lean();
}
