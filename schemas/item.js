import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
	itemID: { type: String, require: true, unique: true },
	itemListID: { type: Number, require: true },
	itemName: { type: String, default: "" },
	itemType: { type: String, default: "" },
	itemCategory: { type: String, default: "" },
	image: { type: String, default: "" },
	price: { type: Number, default: 0 },
	weight: { type: Number, default: 0 },
	brand: { type: String, default: "" },
	model: { type: String, default: "" },
	description: { type: String, default: "" },
	forAuction: { type: Boolean, default: false },
	isRedeemed: { type: Boolean, default: false },
});

let Item;
try {
	Item = mongoose.model("items");
} catch (error) {
	Item = mongoose.model("items", ItemSchema);
}

export default Item;
