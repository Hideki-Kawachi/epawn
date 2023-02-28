import mongoose from "mongoose";

const CustomerInfoSchema = new mongoose.Schema({
	userID: { type: String, require: true, unique: true },
	birthDate: { type: Date, required: true },
	birthPlace: { type: String, required: true },
	contactNumber: { type: String, required: true },
	presentAddress: { type: String, required: true },
	permanentAddress: String,
	sex: String,
	status: String,
	height: Number,
	weight: Number,
	complexion: String,
	identifyingMark: String,
	email: String,
	employerName: String,
	jobPosition: String,
	workNature: String,
	customerInfoSheet: { type: String, required: true },
	validID: { type: String, required: true },
});

let CustomerInfo;
try {
	CustomerInfo = mongoose.model("customerInfo");
} catch (error) {
	CustomerInfo = mongoose.model("customerInfo", CustomerInfoSchema);
}

export default CustomerInfo;
