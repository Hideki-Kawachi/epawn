import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
	{
		itemID: { type: String, require: true, unique: true },
		itemListID: { type: Number, require: true },
		redeemID: { type: String, default: "" },
		itemName: { type: String, default: "" },
		itemType: { type: String, default: "" },
		itemCategory: { type: String, default: "" },
		image: { type: String, default: "" },
		price: { type: Number, default: 0 },
		weight: { type: Number, default: 0 },
		brand: { type: String, default: "" },
		model: { type: String, default: "" },
		color: { type: String, default: "" },
		clarity: { type: String, default: "" },
		purity: { type: String, default: "" },
		carat: { type: Number, default: 0 },
		shape: { type: String, default: "" },
		quantity: { type: Number, default: 0 },
		description: { type: String, default: "" },
		forAuction: { type: Boolean, default: false },
		isRedeemed: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

let Item;
try {
	Item = mongoose.model("items");
} catch (error) {
	Item = mongoose.model("items", ItemSchema);
}

export default Item;
