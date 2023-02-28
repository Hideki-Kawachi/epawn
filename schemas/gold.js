import mongoose from "mongoose";

const GoldSchema = new mongoose.Schema({
	goldID: { type: Number, require: true, unique: true },
	itemID: { type: String, require: true },
	color: { type: String, require: true },
	purity: { type: String, require: true },
});

let Gold;
try {
	Gold = mongoose.model("gold");
} catch (error) {
	Gold = mongoose.model("gold", GoldSchema);
}

export default Gold;
