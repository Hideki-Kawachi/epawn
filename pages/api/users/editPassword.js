import dbConnect from "../../../utilities/dbConnect";
import User from "../../../schemas/user";
import bcrypt from "bcrypt";

export default async function EditPassword(req, res) {
	await dbConnect();

	const body = JSON.parse(req.body);
	const newPassword = body.password;
	const userID = body.userID;

	let newPass = await bcrypt.hash(newPassword, 10);

	let result = await User.updateOne(
		{ userID: userID },
		{
			password: newPass,
		}
	);

	res.json("success", result);
}
