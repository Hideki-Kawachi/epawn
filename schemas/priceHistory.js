import mongoose from "mongoose";

const PriceHistorySchema = new mongoose.Schema({
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
