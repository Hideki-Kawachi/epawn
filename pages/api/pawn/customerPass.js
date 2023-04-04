import dbConnect from "../../../utilities/dbConnect";
import User from "../../../schemas/user";
import bcrypt from "bcrypt";
import crypto from "crypto";

export default async function CustomerPass(req, res) {
	await dbConnect();

	let randomString = "";
	randomString = crypto.randomUUID();
	let stringParts = randomString.split("-");
	let userPass = stringParts[1].concat(stringParts[stringParts.length - 1]);
	let newPass = await bcrypt.hash(userPass, 10);

	let result = await User.findOneAndUpdate(
		{ userID: req.body, password: "", isDisabled: true },
		{ isDisabled: false, password: newPass }
	);

	if (result) {
		res.json(userPass);
	} else {
		res.json(null);
	}
}
