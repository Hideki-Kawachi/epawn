import User from "../../../schemas/user";
import dbConnect from "../../../utilities/dbConnect";
import generateUserID from "../../../utilities/generateUserID";
import bcrypt from "bcrypt";
import EmployeeInfo from "../../../schemas/employeeInfo";

//request needs to have
// role, password, firstname, middlename, lastname, branchID, isDisabled

export default async function CreateEmployee(req, res) {

	dbConnect();

	let body = req.body;

	let userID = await generateUserID();

	let password;

	// bcrypt.hash(body.password, 12, (err, hash) => {
	// 	if (err) {
	// 		res.json("password failed to hash");
	// 	} else {
	// 		password = hash;
	// 	}
	// });

	password = await bcrypt.hash(body.password, 12)

	console.log(password + " and " + body.password)

	let newUser = await User.create({
		userID: userID,
		role: body.role,
		firstName: body.firstName,
		middleName: body.middleName,
		lastName: body.lastName,
		password: password,
		isDisabled: body.isDisabled,
	});

	let newEmployeeInfo = await EmployeeInfo.create({
		userID: userID,
		branchID: body.branchID,
		joinDate: new Date(),
	});

	console.log("NEW USER IS:", newUser, newEmployeeInfo);

	//Transaction.create({customerID: latestID, branchID: body.branchID, })

	res.json("good");
}
