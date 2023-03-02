import dbConnect from "../../utilities/dbConnect";
import User from "../../schemas/user";
import bcrypt from "bcrypt";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../utilities/config";

dbConnect();

export default withIronSessionApiRoute(login, ironOptions);

async function login(req, res) {
	const { userID, password, disabled } = req.body;

	const user = await User.findOne({ userID: userID });

	let isDisabled = true;

	if (user) {
		isDisabled = user.get("disabled");
	}

	if (!user || isDisabled) {
		return res.json("Invalid userID");
	} else {
		const retrievedHash = user.get("password");
		const isMatch = await bcrypt.compare(password, retrievedHash);

		if (isMatch) {
			req.session.userData = {
				userID: user.userID,
				firstName: user.firstName,
				middleName: user.middleName,
				lastName: user.lastName,
				role: user.role,
			};
			await req.session.save();

			if (user.role == "customer") {
				res.json("customer");
			} else {
				res.json("employee");
			}
		} else {
			res.json("Invalid Password");
		}
	}
}
