import mongoose from "mongoose";

const ItemCategorySchema = new mongoose.Schema({
	itemCategoryID: { type: Number, require: true, unique: true },
	itemCategoryName: { type: String, require: true },
});

let ItemCategory;
try {
	ItemCategory = mongoose.model("itemCategories");
} catch (error) {
	ItemCategory = mongoose.model("itemCategories", ItemCategorySchema);
}

export default ItemCategory;
