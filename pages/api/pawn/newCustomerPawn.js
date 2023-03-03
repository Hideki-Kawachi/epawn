import dbConnect from "../../../utilities/dbConnect";
import User from "../../../schemas/user";
import Transaction from "../../../schemas/transaction";
import generateUserID from "../../../utilities/generateUserID";
import EmployeeInfo from "../../../schemas/employeeInfo";
import ItemList from "../../../schemas/itemList";
import generateItemID from "../../../utilities/generateItemID";
import Item from "../../../schemas/item";
import generateItemListID from "../../../utilities/generateItemListID";

// request needs to have
// firstName, lastName, middleName, clerkID
export default async function NewCustomerPawn(req, res) {
	dbConnect();

	let body = JSON.parse(req.body);

	let userID = await generateUserID();
	console.log("LATEST ID IS:", userID);

	let newUser = await User.create({
		userID: userID,
		role: "customer",
		firstName: body.firstName,
		middleName: body.middleName,
		lastName: body.lastName,
	});

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

	console.log("body is:", body);
	let itemListID = await generateItemListID();
	await ItemList.create({
		itemListID: itemListID,
		branchID: branchInfo.branchID,
	});

	body.itemList.map(async (item) => {
		let itemID = await generateItemID();
		await Item.create({
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
			description: "",
			forAuction: false,
			isRedeemed: false,
		});
	});

	await Transaction.create({
		customerID: userID,
		branchID: branchInfo.branchID,
		clerkID: body.clerkID,
		managerID: managerID,
		itemListID: itemListID,
		transactionType: "pawn",
		status: "for appraisal",
		creationDate: new Date(),
	});

	res.json("good");
}
