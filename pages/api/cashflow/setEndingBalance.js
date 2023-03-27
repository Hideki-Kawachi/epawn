import Cashflow from "../../../schemas/cashflow";
import Transaction from "../../../schemas/transaction";
import dbConnect from "../../../utilities/dbConnect";

export default async function setEndingBalance(req, res) {
	await dbConnect();

	let body = JSON.parse(req.body);
	let cashFlowInfo = await Cashflow.findOneAndUpdate(
		{ date: body.date, branchID: body.branchID },
		{
			endingBalance: body.amount,
		}
	);

	let transctionInfo = await Transaction.create({
		customerID: null,
		branchID: body.branchID,
		itemListID: null,
		transactionType: "Ending Balance",
		clerkID: null,
		managerID: body.managerID,
		creationDate: new Date(),
		status: "Done",
		rejectionMessage: "",
		amountPaid: body.amount,
	});

	console.log("trans info:", transctionInfo);
	if (cashFlowInfo && transctionInfo) {
		res.json("success");
	} else {
		res.json("error");
	}
}
