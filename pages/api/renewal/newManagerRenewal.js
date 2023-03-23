import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import User from "../../../schemas/user";
import EmployeeInfo from "../../../schemas/employeeInfo";
import Renew from "../../../schemas/renew";
import generateRenewalID from "../../../utilities/generateRenewalID";
import PawnTicket from "../../../schemas/pawnTicket";
import generatePawnTicketID from "../../../utilities/generatePawnTicketID";
import Branch from "../../../schemas/branch";
export default async function newManagerRenewal(req, res) {
	dbConnect();
	//console.log("LOL")

	let body = JSON.parse(req.body);

	let transac = await Transaction.updateOne(
		{ _id: body.transactionID },
		{
			transactionType: "Renew",
			status: "Approved",
			// rejectMessage: "",
			// amountPaid: body.totalAmount,
		}
	);

	//console.log("Manager ID is " + managerID);

	//console.log(JSON.stringify(newTransaction))

	// get current and ending pawnticket number for branch
	let pawnTicketInfo = await Branch.findOne(
		{ branchID: body.branchID },
		{ currentPawnTicketID: 1, endingPawnTicketID: 1 }
	);

	let loanDate = new Date();
	let newPawnTicketID = pawnTicketInfo.currentPawnTicketID;
	console.log("BRANCH PT IS:" + newPawnTicketID);
	let pawnTicketID = await generatePawnTicketID(newPawnTicketID);
	console.log("GENERATED PT ID IS:", pawnTicketID);
	let pt = null;

	// check if pawnticket already exists with PT Number
	let pawnTicketExists = await PawnTicket.find({
		transactionID: body.transactionID,
		pawnTicketID: pawnTicketID,
	}).lean();

	if (pawnTicketExists.length == 0) {
		pt = await PawnTicket.create({
			pawnTicketID: pawnTicketID,
			transactionID: body.transactionID,
			customerID: body.customerID,
			itemListID: body.itemListID,
			loanDate: loanDate,
			maturityDate: new Date().setDate(loanDate.getDate() + 30),
			expiryDate: new Date().setDate(loanDate.getDate() + 120),
			loanAmount: body.newLoanAmount,
			isInactive: false,
		});
		console.log("PT AFTER CREATE IS:", pt);
	} else {
		res.json("error pt already exists");
	}

	if (pt) {
		await Branch.findOneAndUpdate(
			{ branchID: body.branchID },
			{ currentPawnTicketID: pawnTicketID }
		);
	}

	let oldPT = await PawnTicket.updateOne(
		{ pawnTicketID: body.oldPawnTicket },
		{ isInactive: true }
	);

	let renew = await Renew.updateOne(
		{ renewID: body.renewID },
		{
			newPawnTicketID: pawnTicketID,
		}
	);

	if (transac && renew && oldPT) {
		res.json("renew posted successfully");
	} else {
		res.json("error");
	}
}
