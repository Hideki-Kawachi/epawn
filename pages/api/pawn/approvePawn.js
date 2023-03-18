import mongoose, { mongo } from "mongoose";
import Branch from "../../../schemas/branch";
import Item from "../../../schemas/item";
import ItemList from "../../../schemas/itemList";
import PawnTicket from "../../../schemas/pawnTicket";
import Transaction from "../../../schemas/transaction";
import dbConnect from "../../../utilities/dbConnect";
import generateItemListID from "../../../utilities/generateItemListID";
import generatePawnTicketID from "../../../utilities/generatePawnTicketID";

export default async function ApprovePawn(req, res) {
	await dbConnect();
	let body = JSON.parse(req.body);
	let pawnTicketList = body.pawnTicketList;
	let transactionID = body.transactionID;
	let branchID = body.branchID;

	// update transaction status to approved
	await Transaction.findByIdAndUpdate(
		new mongoose.Types.ObjectId(transactionID),
		{ status: "approved" }
	);

	// get current and ending pawnticket number for branch
	let pawnTicketInfo = await Branch.findOne(
		{ branchID: branchID },
		{ currentPawnTicketID: 1, endingPawnTicketID: 1 }
	);

	let newPawnTicketID = pawnTicketInfo.currentPawnTicketID;
	for (let pawnTicket of pawnTicketList) {
		// generate and update pawnticket ID
		newPawnTicketID = generatePawnTicketID(pawnTicketInfo);
		if (newPawnTicketID == pawnTicketInfo.endingPawnTicketID) {
			res.json("error");
		} else {
			await PawnTicket.findByIdAndUpdate(
				new mongoose.Types.ObjectId(pawnTicket.ptID),
				{ pawnTicketID: newPawnTicketID }
			);
		}
	}

	res.json("success");
}
