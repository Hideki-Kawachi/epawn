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
	Branch = mongoose.model("branches");
} catch (error) {
	Branch = mongoose.model("branches", BranchSchema);
}

export default Branch;
