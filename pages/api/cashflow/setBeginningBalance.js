import Cashflow from "../../../schemas/cashflow";
import Transaction from "../../../schemas/transaction";
import dbConnect from "../../../utilities/dbConnect";

export default async function setBeginningBalance(req, res) {
	await dbConnect();

	let body = JSON.parse(req.body);
	let cashFlowInfo = await Cashflow.create({
		date: body.date,
		beginningBalance: body.amount,
		branchID: body.branchID,
		endingBalance: 0,
	});

	let transctionInfo = await Transaction.create({
		customerID: null,
		branchID: body.branchID,
		itemListID: null,
		transactionType: "Beginning Balance",
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
