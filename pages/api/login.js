import dbConnect from "../../utilities/dbConnect";
import User from "../../schemas/user";
import bcrypt from "bcrypt";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../utilities/config";
import EmployeeInfo from "../../schemas/employeeInfo";

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
			if (user.role == "customer") {
				req.session.userData = {
					userID: user.userID,
					firstName: user.firstName,
					middleName: user.middleName,
					lastName: user.lastName,
					role: user.role,
				};
				await req.session.save();
				res.json("customer");
			} else {
				let branchInfo = await EmployeeInfo.findOne(
					{ userID: user.userID },
					{ branchID: 1 }
				);
				req.session.userData = {
					userID: user.userID,
					firstName: user.firstName,
					middleName: user.middleName,
					lastName: user.lastName,
					role: user.role,
					branchID: branchInfo.branchID,
				};
				await req.session.save();
				res.json("employee");
			}
		} else {
			res.json("Invalid Password");
		}
	}
}
