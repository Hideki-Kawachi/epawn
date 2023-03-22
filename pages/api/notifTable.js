import mongoose from "mongoose";
import Transaction from "../../schemas/transaction";
import User from "../../schemas/user";
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
		let customerData = await User.find({}).lean();
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

		console.log("transac data:", transactionData);
		if (transactionData[0].updatedAt) {
			transactionData.sort((a, b) => {
				return new Date(a.updatedAt) > new Date(b.updatedAt);
			});
		} else {
			await changeStream.close();
		}

		let notifData = [];
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

		await changeStream.close();
		res.json(notifData);
	});
}
