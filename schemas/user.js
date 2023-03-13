import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	userID: { type: String, require: true, unique: true, default: "AAA-000" },
	role: { type: String, require: true, default: "" },
	firstName: { type: String, require: true },
	middleName: { type: String, default: "" },
	lastName: { type: String, require: true },
	password: { type: String, default: "" },
	isDisabled: { type: Boolean, default: false },
	// branchID: { type: String, default:""}
});

let User;
try {
	User = mongoose.model("users");
} catch (error) {
	User = mongoose.model("users", UserSchema);
}

export default User;
