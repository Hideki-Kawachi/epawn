import mongoose from "mongoose";
import Transaction from "../../schemas/transaction";
import dbConnect from "../../utilities/dbConnect";

export default async function NotifTable(req, res) {
	let userInfo = req.headers;

	const changeStream = await Transaction.watch().on("change", async (data) => {
		await dbConnect();
		// console.log(
		// 	"userInfo IS:",
		// 	userInfo.role,
		// 	userInfo.branchid,
		// 	userInfo.userid
		// );
		let transactionData;
		if (userInfo.role == "clerk") {
			transactionData = await Transaction.find({
				branchID: userInfo.branchid,
				clerkID: userInfo.userid,
				status: { $ne: "Done" },
			}).lean();
		} else if (userInfo.role == "manager") {
			transactionData = await Transaction.find({
				branchID: userInfo.branchid,
				managerID: userInfo.userid,
				status: { $ne: "Done" },
			}).lean();
		}

		await changeStream.close();
		res.json(transactionData);
	});
}
