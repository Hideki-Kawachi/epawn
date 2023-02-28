import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
	transactionID: { type: Number, require: true, unique: true },
	customerID: { type: String, require: true },
	branchID: { type: Number, require: true },
	itemListID: { type: Number },
	transactionType: { type: String, require: true },
	clerkID: { type: String, require: true },
	managerID: { type: String, require: true },
	creationDate: { type: Date, require: true, default: new Date() },
	status: { type: String },
	isRejected: { type: Boolean, default: false },
	rejectionReason: { type: String },
});

let Transaction;
try {
	Transaction = mongoose.model("transactions");
} catch (error) {
	Transaction = mongoose.model("transactions", TransactionSchema);
}

export default Transaction;
