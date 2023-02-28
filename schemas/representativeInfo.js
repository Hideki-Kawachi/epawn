import mongoose from "mongoose";

const RepresentativeInfoSchema = new mongoose.Schema({
	userID: { type: String, require: true },
	authorization: { type: String, require: true },
	validID: { type: String, require: true },
});

let RepresentativeInfo;
try {
	RepresentativeInfo = mongoose.model("representativeInfo");
} catch (error) {
	RepresentativeInfo = mongoose.model(
		"representativeInfo",
		RepresentativeInfoSchema
	);
}

export default RepresentativeInfo;
