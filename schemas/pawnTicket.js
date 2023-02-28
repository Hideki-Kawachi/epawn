import mongoose from "mongoose";

const PawnTicketSchema = new mongoose.Schema({
	pawnTicketID: { type: String, require: true, unique: true },
	transactionID: { type: Number, require: true, unique: true },
	customerID: { type: String, require: true },
	loanDate: { type: Date, require: true },
	maturityDate: { type: Date, require: true },
	expiryDate: { type: Date, require: true },
	loanAmount: { type: Number, require: true },
	isInactive: { type: Boolean, require: false },
});

let PawnTicket;
try {
	PawnTicket = mongoose.model("pawnTickets");
} catch (error) {
	PawnTicket = mongoose.model("pawnTickets", PawnTicketSchema);
}

export default PawnTicket;
