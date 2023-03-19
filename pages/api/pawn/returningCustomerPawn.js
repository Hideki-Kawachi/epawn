import dbConnect from "../../../utilities/dbConnect";
import User from "../../../schemas/user";
import Transaction from "../../../schemas/transaction";
import EmployeeInfo from "../../../schemas/employeeInfo";
import ItemList from "../../../schemas/itemList";
import generateItemID from "../../../utilities/generateItemID";
import Item from "../../../schemas/item";
import generateItemListID from "../../../utilities/generateItemListID";
import PriceHistory from "../../../schemas/priceHistory";

// request needs to have
// firstName, lastName, middleName, clerkID, askPrice
export default async function NewCustomerPawn(req, res) {
	dbConnect();

	let body = JSON.parse(req.body);

	let branchInfo = await EmployeeInfo.findOne({ userID: body.clerkID });

	let branchManagers = await User.find({
		role: "manager",
		isDisabled: false,
	}).lean();

	let managerID;

	branchManagers.map(async (branchManager) => {
		let temp = await EmployeeInfo.findOne({
			userID: branchManager.userID,
			branchID: branchInfo.branchID,
		});

		// console.log("TEMP IS:", temp);

		if (temp) {
			managerID = branchManager.userID;
			//console.log("BM:", branchManager.userID, "--", temp);
		}
	});

	//console.log("body is:", body);
	let itemListID = await generateItemListID();
	await ItemList.create({
		itemListID: itemListID,
		branchID: branchInfo.branchID,
	});

	let latestItem = await Item.find({}).sort({ itemID: -1 }).limit(1);

	let itemID = "AA-000000";
	console.log("latest item is:", latestItem);

	if (latestItem.length > 0) {
		itemID = generateItemID(latestItem[0].itemID);
	}

	let itemCreate = [];

	body.itemList.map((item) => {
		// console.log("LOOP");
		itemCreate.push({
			itemID: itemID,
			itemListID: itemListID,
			itemName: item.name,
			itemType: item.type,
			image: item.image,
			itemCategory: "",
			price: 0,
			weight: 0,
			brand: "",
			model: "",
			color: "",
			clarity: "",
			purity: "",
			carat: 0,
			shape: "",
			quantity: 0,
			description: "",
			forAuction: false,
			isRedeemed: false,
		});
		itemID = generateItemID(itemID);
	});
	console.log("ITEM CREATE IS:", itemCreate);
	let items = await Item.insertMany(itemCreate);

	let newTransaction = await Transaction.create({
		customerID: body.userID,
		branchID: branchInfo.branchID,
		clerkID: body.clerkID,
		managerID: managerID,
		itemListID: itemListID,
		transactionType: "pawn",
		status: "for appraisal",
		creationDate: new Date(),
		rejectionMessage: "",
		amountPaid: 0,
	});

	let priceHistory = await PriceHistory.create({
		transactionID: newTransaction._id,
		askPrice: body.askPrice,
		appraisalPrice: 0,
	});

	if (newTransaction && itemCreate && priceHistory && items) {
		res.json("success");
	} else {
		res.json("error");
	}
}
