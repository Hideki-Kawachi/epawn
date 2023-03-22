import dayjs from "dayjs";
import mongoose from "mongoose";
import Branch from "../../../schemas/branch";
import CustomerInfo from "../../../schemas/customerInfo";
import Item from "../../../schemas/item";
import ItemList from "../../../schemas/itemList";
import PawnTicket from "../../../schemas/pawnTicket";
import Transaction from "../../../schemas/transaction";
import User from "../../../schemas/user";
import dbConnect from "../../../utilities/dbConnect";
import generatePawnTicketID from "../../../utilities/generatePawnTicketID";
import bcrypt from "bcrypt";

export default async function ApprovePawn(req, res) {
	await dbConnect();
	let body = JSON.parse(req.body);
	let pawnTicketList = body.pawnTicketList;
	let transactionData = body.transactionData;
	let branchID = body.branchID;

	// get current and ending pawnticket number for branch
	let pawnTicketInfo = await Branch.findOne(
		{ branchID: branchID },
		{ currentPawnTicketID: 1, endingPawnTicketID: 1 }
	);

	// check if pawnticket already exists with PT Number
	let pawnTicketExists = await PawnTicket.find({
		transactionID: transactionData._id,
		pawnTicketID: { $exists: true },
		$expr: { $gt: [{ $strLenCP: "$pawnTicketID" }, 1] },
	});

	let pawnTicketPrint = [];
	let totalNetProceeds = 0;
	let newPawnTicketID = pawnTicketInfo.currentPawnTicketID;
	for (let pawnTicket of pawnTicketList) {
		// generate and update pawnticket ID
		newPawnTicketID = generatePawnTicketID(newPawnTicketID);
		let ptInfo = {};

		if (newPawnTicketID == pawnTicketInfo.endingPawnTicketID) {
			res.json("error");
		} else {
			if (pawnTicketExists.length == 0) {
				ptInfo = await PawnTicket.findByIdAndUpdate(
					new mongoose.Types.ObjectId(pawnTicket.ptID),
					{ pawnTicketID: newPawnTicketID }
				);
			} else {
				ptInfo = await PawnTicket.findById(
					new mongoose.Types.ObjectId(pawnTicket.ptID)
				);
			}
			let itemList = await Item.find({ itemListID: ptInfo.itemListID }).lean();
			let userDetails = await User.findOne({ userID: ptInfo.customerID });
			let customerDetails = await CustomerInfo.findOne({
				userID: ptInfo.customerID,
			});
			let customerName = "";
			if (userDetails.middleName.length > 0) {
				customerName =
					userDetails.firstName +
					" " +
					userDetails.middleName.charAt(0) +
					". " +
					userDetails.lastName;
			} else {
				customerName = userDetails.firstName + " " + userDetails.lastName;
			}

			let itemDescription = "";
			itemList.forEach((item, index) => {
				let tempString = "";
				if (index != itemList.length - 1) {
					tempString = item.itemName + " " + item.weight + " grams, ";
				} else {
					tempString = item.itemName + " " + item.weight + " grams";
				}
				itemDescription = itemDescription.concat(tempString);
			});
			totalNetProceeds += ptInfo.loanAmount - ptInfo.loanAmount * 0.035;

			pawnTicketPrint.push({
				pawnTicketID: newPawnTicketID,
				customerName: customerName,
				address: customerDetails.presentAddress,
				appraisalValue: ptInfo.loanAmount.toFixed(2),
				loanDate: dayjs(ptInfo.loanDate).format("MMMM DD,YYYY"),
				maturityDate: dayjs(ptInfo.maturityDate).format("MMMM DD,YYYY"),
				expiryDate: dayjs(ptInfo.expiryDate).format("MMMM DD,YYYY"),
				itemDescription: itemDescription,
				loanAmount: ptInfo.loanAmount.toFixed(2),
				interest: (ptInfo.loanAmount * 0.035).toFixed(2),
				netProceeds: (ptInfo.loanAmount - ptInfo.loanAmount * 0.035).toFixed(2),
				clerkID: transactionData.clerkID,
			});
		}
	}

	// update transaction status to approved
	await Transaction.findByIdAndUpdate(
		new mongoose.Types.ObjectId(transactionData._id),
		{ status: "Approved", amountPaid: -totalNetProceeds }
	);

	if (pawnTicketExists.length == 0) {
		await Branch.findOneAndUpdate(
			{ branchID: branchID },
			{ currentPawnTicketID: newPawnTicketID }
		);
	}

	res.json(pawnTicketPrint);
}

// {
// 	pawnTicketID: "A-123456",
// 	customerName: "Imelda C De Guzman",
// 	address: "143 Pasig city",
// 	appraisalValue: "14,201.00",
// 	loanDate: "February 7, 2023",
// 	maturityDate: "March 7, 2023",
// 	expiryDate: "April 7, 2023",
// 	itemDescription: "Gold ring 0.75grams, Rolex Daytona 41.22 grams",
// 	loanAmount: "14,402.00",
// 	interest: "402.00",
// 	netProceeds: "13,240.00",
// 	clerkID: "AAA-001",
// }
