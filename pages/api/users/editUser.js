import dbConnect from "../../../utilities/dbConnect";
import User from "../../../schemas/user";
import bcrypt from "bcrypt";
import Branch from "../../../schemas/branch";
import EmployeeInfo from "../../../schemas/employeeInfo";

export default async function EditUser(req, res){

	await dbConnect();

	const userInfo = req.body;

    let origPass = await User.findOne(
        { userID: userInfo.userID },
        {
            password: 1
        }
    )

    let currPassword; 


    if (origPass.password != userInfo.password.toString()){

        console.log("not same (new password input) ")
        currPassword = await bcrypt.hash(userInfo.password, 10)

    } else {
		console.log("same hash")
		currPassword = userInfo.password
	}



	let result = await User.updateOne(
		{ userID: userInfo.userID },
		{
			firstName: userInfo.firstName,
            middleName: userInfo.middleName,
			lastName: userInfo.lastName,
			password: currPassword,
			role: userInfo.role,
			isDisabled: userInfo.isDisabled,
		}
	);

	//Needed later
	// if (userInfo.role == "manager") {

	// 	let branch = await Branch.findOne({userID: req.query.value,}, {branchID: 1} );
	// 	let branchID = branch.branchID

	// 	let userIDList = await EmployeeInfo.find({ branchID }, {userID: 1, branchID: 1})

	// 	console.log(userIDList)


	// 	// const userList = await User.find(
	// 	// 	{ roleName: "manager"},
	// 	// 	{ firstName: 1}
	// 	// )

	// 	// console.log("users are:" + userList.firstName)
	// }

    //add branchid 

	if (result.modifiedCount == 0 && result.matchedCount > 0) {
		res.json("No Fields Edited");
	} else if (result.modifiedCount == 0) {
		res.json("Edit is Invalid");
	} else {
		res.json("User Successfully Edited!");
	}
};