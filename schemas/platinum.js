import mongoose from "mongoose";

const PlatinumSchema = new mongoose.Schema({
	platinumID: { type: Number, require: true, unique: true },
	itemID: { type: String, require: true },
	purity: { type: String, require: true },
});

let Platinum;
try {
	Platinum = mongoose.model("platinum");
} catch (error) {
	Platinum = mongoose.model("platinum", PlatinumSchema);
}

export default Platinum;
