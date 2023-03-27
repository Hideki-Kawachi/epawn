import mongoose from "mongoose";

const CashflowSchema = new mongoose.Schema({
	branchID: { type: Number, require: true },
	beginningBalance: { type: Number },
	endingBalance: { type: Number },
	date: { type: String },
});

let Cashflow;
try {
	Cashflow = mongoose.model("cashflow");
} catch (error) {
	Cashflow = mongoose.model("cashflow", CashflowSchema);
}

export default Cashflow;
