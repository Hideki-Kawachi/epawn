import mongoose from "mongoose";

const PriceHistorySchema = new mongoose.Schema({
	priceHistoryID: { type: String, require: true, unique: true },
	transactionID: { type: String, require: true },
	askPrice: Number,
	appraisalPrice: Number,
});

let PriceHistory;
try {
	PriceHistory = mongoose.model("priceHistory");
} catch (error) {
	PriceHistory = mongoose.model("priceHistory", PriceHistorySchema);
}

export default PriceHistory;
