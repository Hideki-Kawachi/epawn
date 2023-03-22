import dbConnect from "../../../../utilities/dbConnect";
import User from "../../../../schemas/user";
import bcrypt from "bcrypt";
import crypto from "crypto";

export default async function NewCustomerPass(req, res) {
	await dbConnect();

	let randomString = "";
	randomString = crypto.randomUUID();
	let stringParts = randomString.split("-");
	let userPass = stringParts[1].concat(stringParts[stringParts.length - 1]);
	let newPass = await bcrypt.hash(userPass, 10);

	await User.findOneAndUpdate(
		{ userID: req.body },
		{ isDisabled: false, password: newPass }
	);

	res.json(userPass);
}
