import mongoose from "mongoose";

const ItemTypeSchema = new mongoose.Schema({
	itemTypeID: { type: Number, require: true, unique: true },
	itemTypeName: { type: String, require: true },
});

let ItemType;
try {
	ItemType = mongoose.model("itemTypes");
} catch (error) {
	ItemType = mongoose.model("itemTypes", ItemTypeSchema);
}

export default ItemType;
