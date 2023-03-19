import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    customerID: { type: String, require: true },
    branchID: { type: Number, require: true },
    itemListID: { type: Number, default: "" },
    transactionType: { type: String, require: true, default: "" },
    clerkID: { type: String, require: true, default: "" },
    managerID: { type: String, require: true, default: "" },
    creationDate: { type: Date, require: true, default: new Date() },
    status: { type: String, default: "" },
    rejectionMessage: { type: String, default: "" },
    amountPaid: { type: Number, default: "" },
  },
  { timestamps: true }
);

let Transaction;
try {
	Transaction = mongoose.model("transactions");
} catch (error) {
	Transaction = mongoose.model("transactions", TransactionSchema);
}

export default Transaction;
