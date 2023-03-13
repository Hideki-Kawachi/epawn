import dbConnect from "../../../utilities/dbConnect";
import User from "../../../schemas/user";

export default async function EditUser(req, res){

	await dbConnect();

	const userInfo = req.body;

	let result = await User.updateOne(
		{ userID: userInfo.userID },
		{
			firstName: userInfo.firstName,
            middleName: userInfo.middleName,
			lastName: userInfo.lastName,
			password: userInfo.password,
			role: userInfo.role,
			isDisabled: userInfo.isDisabled,
		}
	);

    //add branchid 

	if (result.modifiedCount == 0 && result.matchedCount > 0) {
		res.json("No Fields Edited");
	} else if (result.modifiedCount == 0) {
		res.json("Edit is Invalid");
	} else {
		res.json("User Successfully Edited!");
	}
};