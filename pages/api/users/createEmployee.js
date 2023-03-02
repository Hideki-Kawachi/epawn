import User from "../../../schemas/user";
import dbConnect from "../../../utilities/dbConnect";
import generateUserID from "../../../utilities/generateUserID";
import bcrypt from "bcrypt";
import EmployeeInfo from "../../../schemas/employeeInfo";

//request needs to have
// role, password, firstname, middlename, lastname, branchID

export default async function CreateEmployee(req, res) {
	dbConnect();

	let body = JSON.parse(req.body);

	let userID = await generateUserID();

	let password;
	bcrypt.hash(body.password, 12, (err, hash) => {
		if (err) {
			res.json("password failed to hash");
		} else {
			password = hash;
		}
	});

	let newUser = await User.create({
		userID: userID,
		role: body.role,
		password: password,
		firstName: body.firstName,
		middleName: body.middleName,
		lastName: body.lastName,
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
