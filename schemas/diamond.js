import mongoose from "mongoose";

const DiamondSchema = new mongoose.Schema({
	diamondID: { type: Number, require: true, unique: true },
	itemID: { type: String, require: true },
	colorGrade: String,
	clarity: { type: String, require: true },
	carat: { type: Number, require: true },
	quantity: Number,
	shape: String,
});

let Diamond;
try {
	Diamond = mongoose.model("diamond");
} catch (error) {
	Diamond = mongoose.model("diamond", DiamondSchema);
}

export default Diamond;
