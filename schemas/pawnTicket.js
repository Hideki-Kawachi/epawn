import mongoose from "mongoose";

const PawnTicketSchema = new mongoose.Schema({
	pawnTicketID: { type: String },
	transactionID: { type: String, require: true },
	customerID: { type: String, require: true },
	loanDate: { type: Date, require: true },
	maturityDate: { type: Date, require: true },
	expiryDate: { type: Date, require: true },
	loanAmount: { type: Number, require: true },
	isInactive: { type: Boolean, require: true },
});

let PawnTicket;
try {
	PawnTicket = mongoose.model("pawnTickets");
} catch (error) {
	PawnTicket = mongoose.model("pawnTickets", PawnTicketSchema);
}

export default PawnTicket;
