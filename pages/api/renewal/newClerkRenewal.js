import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import User from "../../../schemas/user";
import EmployeeInfo from "../../../schemas/employeeInfo";
import Renew from "../../../schemas/renew";
import generateRenewalID from "../../../utilities/generateRenewalID";

export default async function newClerkRedeem(req, res) {
	dbConnect();
	//console.log("LOL")

	let body = JSON.parse(req.body);

	let branchInfo = await EmployeeInfo.findOne({ userID: body.clerkID });

	let branchManagers = await User.find({
		role: "manager",
		isDisabled: false,
	}).lean();

	let managerID;

	// branchManagers.map(async (branchManager) => {
	//     let temp = await EmployeeInfo.findOne({
	//         userID: branchManager.userID,
	//         branchID: branchInfo.branchID
	//     });

	//     if (temp){
	//         managerID = branchManager.userID;
	//        // console.log("Manager ID is " + managerID);
	//     }
	// })

	for (const branchManager of branchManagers) {
		let temp = await EmployeeInfo.findOne({
			userID: branchManager.userID,
			branchID: branchInfo.branchID,
		});

		if (temp) {
			managerID = branchManager.userID;
			break; // exit the loop once a manager is found
		}
	}

	let newTransaction = await Transaction.create({
		customerID: body.customerID,
		branchID: branchInfo.branchID,
		clerkID: body.clerkID,
		managerID: managerID,
		itemListID: body.itemListID,
		transactionType: "Renew",
		status: "Pending",
		creationDate: new Date(),
		rejectMessage: "",
		amountPaid: body.totalAmount,
	});

	console.log("Manager ID is " + managerID);

	//console.log(JSON.stringify(newTransaction))

	let renewID = await generateRenewalID();

	let newRenew = await Renew.create({
		renewID: renewID,

		transactionID: newTransaction._id,
		pawnTicketID: body.pawnTicketID,
		payment: body.totalAmount,
		redeemerID: body.customerID,
		redeemDate: new Date(),
	});

	if (newTransaction && newRenew) {
		res.json("renew posted successfully");
	} else {
		res.json("error");
	}
}
