import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import User from "../../../schemas/user";
import EmployeeInfo from "../../../schemas/employeeInfo";
import Renew from "../../../schemas/renew";
import generateRenewalID from "../../../utilities/generateRenewalID";
import PawnTicket from "../../../schemas/pawnTicket";
import mongoose from "mongoose";

export default async function OnlineRenewal(req, res) {
	await dbConnect();
	//console.log("LOL")

	let body = JSON.parse(req.body);
	let pawnTicketData = body.pawnTicketData;
	let currentUser = body.currentUser;

	let pawnTicketInfo = await PawnTicket.findOne({
		pawnTicketID: pawnTicketData.oldPawnTicketID,
	});
	let transactionInfo = await Transaction.findById(
		new mongoose.Types.ObjectId(pawnTicketInfo.transactionID)
	);
	let employeeInfo = await EmployeeInfo.findOne({
		userID: transactionInfo.managerID,
	});

	let newTransaction = await Transaction.create({
		customerID: currentUser.userID,
		branchID: employeeInfo.branchID,
		clerkID: "",
		managerID: transactionInfo.managerID,
		itemListID: pawnTicketInfo.itemListID,
		transactionType: "Renew(Online)",
		status: "Pending",
		creationDate: new Date(),
		rejectMessage: "",
		amountPaid: pawnTicketData.amountPaid,
	});

	let renewID = await generateRenewalID();

	let newRenew = await Renew.create({
		renewID: renewID,
		transactionID: newTransaction._id,
		prevPawnTicketID: pawnTicketData.oldPawnTicketID,
		newPawnTicketID: "",
		payment: pawnTicketData.amountPaid,
		renewDate: new Date(),
	});

	if (newTransaction && newRenew) {
		res.json("renew posted successfully");
	} else {
		res.json("error");
	}
}
