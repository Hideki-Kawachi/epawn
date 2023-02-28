import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
	itemID: { type: String, require: true, unique: true },
	itemListID: { type: Number, require: true },
	itemName: String,
	itemTypeID: Number,
	itemCategoryID: Number,
	image: String,
	price: Number,
	weight: Number,
	brand: String,
	model: String,
	description: String,
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
