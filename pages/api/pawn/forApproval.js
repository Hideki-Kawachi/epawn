import mongoose from "mongoose";
import Item from "../../../schemas/item";
import ItemList from "../../../schemas/itemList";
import PawnTicket from "../../../schemas/pawnTicket";
import Transaction from "../../../schemas/transaction";
import dbConnect from "../../../utilities/dbConnect";
import generateItemListID from "../../../utilities/generateItemListID";

export default async function forApproval(req, res) {
	await dbConnect();
	let body = JSON.parse(req.body);
	let pawnTicketList = body.pawnTicketList;
	let transactionData = body.transactionData;

	console.log("transaction data:", transactionData);

	// update transaction status and delete itemListID
	await Transaction.findByIdAndUpdate(
		new mongoose.Types.ObjectId(transactionData._id),
		{ status: "For Approval", itemListID: null }
	);

	await ItemList.deleteOne({ itemListID: transactionData.itemListID });

	let itemListID = await generateItemListID();
	let index = -1;

	for (let pawnTicket of pawnTicketList) {
		// create new item list per pawn ticket item list
		index++;
		console.log("item list id:", itemListID + index);
		let loanAmount = 0;
		await ItemList.create({
			itemListID: itemListID + index,
			branchID: transactionData.branchID,
		});

		// update itemListID of all items
		for (let item of pawnTicket.itemList) {
			console.log("ITEM ITEM:", itemListID + index);
			await Item.findOneAndUpdate(
				{ itemID: item.itemID },
				{ itemListID: itemListID + index }
			);
			loanAmount += item.price;
		}

		// create pawnTicket with no pawnTicketID
		let loanDate = new Date();
		await PawnTicket.create({
			pawnTicketID: "",
			transactionID: transactionData._id,
			customerID: transactionData.customerID,
			itemListID: itemListID + index,
			loanDate: loanDate,
			maturityDate: new Date().setDate(loanDate.getDate() + 30),
			expiryDate: new Date().setDate(loanDate.getDate() + 90),
			loanAmount: loanAmount,
			isInactive: false,
		});
	}

	res.json("success");
}
