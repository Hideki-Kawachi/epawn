import mongoose from "mongoose";

const EmployeeInfoSchema = new mongoose.Schema({
	userID: { type: String, require: true, unique: true },
	branchID: { type: Number },
	joinDate: { type: Date, default: new Date() },
});

let EmployeeInfo;
try {
	EmployeeInfo = mongoose.model("employeeInfo");
} catch (error) {
	EmployeeInfo = mongoose.model("employeeInfo", EmployeeInfoSchema);
}

export default EmployeeInfo;
