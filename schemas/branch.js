import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
	branchID: { type: Number, require: true, unique: true },
	branchName: { type: String, require: true },
	branchAddres: { type: String, require: true },
	currentPawnTicketID: { type: String },
	endingPawnTicketID: { type: String },
});

let Branch;
try {
	Branch = mongoose.model("branch");
} catch (error) {
	Branch = mongoose.model("branch", BranchSchema);
}

export default Branch;
