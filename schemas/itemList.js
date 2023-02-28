import mongoose from "mongoose";

const ItemListSchema = new mongoose.Schema({
	itemListID: { type: Number, require: true, unique: true },
	branchID: { type: Number, require: true },
});

let ItemList;
try {
	ItemList = mongoose.model("itemLists");
} catch (error) {
	ItemList = mongoose.model("itemLists", ItemListSchema);
}

export default ItemList;
