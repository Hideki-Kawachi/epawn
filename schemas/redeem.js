import mongoose from "mongoose";

const RedeemSchema = new mongoose.Schema({
	redeemID: { type: Number, require: true, unique: true },
	transactionID: { type: Number, require: true, unique: true },
	pawnTicketID: { type: String, require: true },
	payment: { type: Number, require: true },
	redeemerID: { type: String, require: true },
	redeemDate: { type: Date, require: true },
});

let Redeem;
try {
	Redeem = mongoose.model("redeem");
} catch (error) {
	Redeem = mongoose.model("redeem", RedeemSchema);
}

export default Redeem;
