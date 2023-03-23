import dbConnect from "../../../../utilities/dbConnect";
import CustomerInfo from "../../../../schemas/customerInfo";

export default async function EditProfile(req, res) {
	await dbConnect();

	let body = JSON.parse(req.body);
	let userID = body.userID;
	let contactNum = body.contactNum;
	let presentAdd = body.presentAdd;

	let result = await CustomerInfo.updateOne(
		{ userID: userID },
		{ contactNumber: contactNum, presentAddress: presentAdd }
	);

	res.json("success", result);
}
