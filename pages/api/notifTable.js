import mongoose from "mongoose";
import Transaction from "../../schemas/transaction";
import User from "../../schemas/user";
import dbConnect from "../../utilities/dbConnect";

export default async function NotifTable(req, res) {
	let userInfo = req.headers;
	await dbConnect();
	const changeStream = await Transaction.watch().on("change", async (data) => {
		let transactionData;
		let customerData = await User.find({}).lean();
		if (userInfo.role == "clerk") {
			transactionData = await Transaction.find({
				branchID: userInfo.branchid,
				clerkID: userInfo.userid,
				status: { $ne: "Done" },
			})
				.sort({ updatedAt: -1 })
				.lean();
		} else if (userInfo.role == "manager") {
			transactionData = await Transaction.find({
				branchID: userInfo.branchid,
				managerID: userInfo.userid,
				status: { $ne: "Done" },
			})
				.sort({ updatedAt: -1 })
				.lean();
		}
		console.log("transac data:", transactionData);

		let notifData = [];
		if (transactionData) {
			if (transactionData[0].updatedAt) {
				// transactionData.sort((a, b) => {
				// 	return new Date(a.updatedAt) > new Date(b.updatedAt);
				// });

				transactionData.forEach((transaction) => {
					let customerInfo = customerData.find(
						(customer) => customer.userID == transaction.customerID
					);
					// console.log("CUST INFO:", customerInfo);
					notifData.push({
						_id: transaction._id,
						customerName: customerInfo.firstName + " " + customerInfo.lastName,
						date: transaction.updatedAt
							.toDateString()
							.substring(4, transaction.creationDate.length),
						time: transaction.updatedAt.toLocaleTimeString("en-GB"),
						transactionType: transaction.transactionType,
						status: transaction.status,
					});
				});
			} else {
				await changeStream.close();
				res.json(notifData);
			}
		} else {
			await changeStream.close();
			res.json(notifData);
		}

		await changeStream.close();
		res.json(notifData);
	});
}
