import mongoose from "mongoose";

const RenewSchema = new mongoose.Schema({
	renewID: { type: String, require: true, unique: true },
	transactionID: { type: String, require: true, unique: true },
	newPawnTicketID: { type: String, require: true },
	prevPawnTicketID: { type: String, require: true },
	payment: { type: Number, require: true },
	renewDate: { type: Date, require: true },
});

let Renew;
try {
	Renew = mongoose.model("renew");
} catch (error) {
	Renew = mongoose.model("renew", RenewSchema);
}

export default Renew;
