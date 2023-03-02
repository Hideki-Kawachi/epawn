import dbConnect from "../../../utilities/dbConnect";
import User from "../../../schemas/user";
import Transaction from "../../../schemas/transaction";
import generateUserID from "../../../utilities/generateUserID";

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

	console.log("NEW USER IS:", newUser);

	//Transaction.create({customerID: latestID, branchID: body.branchID, })

	res.json("good");
}
