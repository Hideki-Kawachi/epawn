import CustomerInfo from "../../../schemas/customerInfo";
import dbConnect from "../../../utilities/dbConnect";

export default async function UpdateCustomerInfo(req, res) {
	let customerInfo = JSON.parse(req.body);

	await dbConnect();

	let result = await CustomerInfo.findOneAndUpdate(
		{ userID: customerInfo.userID },
		{
			birthDate: customerInfo.birthDate,
			birthPlace: customerInfo.birthPlace,
			contactNumber: customerInfo.contactNumber,
			presentAddress: customerInfo.presentAddress,
			sex: customerInfo.sex,
			status: customerInfo.status,
			height: customerInfo.height,
			weight: customerInfo.weight,
			complexion: customerInfo.complexion,
			identifyingMark: customerInfo.identifyingMark,
			email: customerInfo.email,
			employerName: customerInfo.employerName,
			jobPosition: customerInfo.jobPosition,
			workNature: customerInfo.workNature,
			customerInfoSheet: customerInfo.customerInfoSheet,
			validID: customerInfo.validID,
		}
	);

	if (result) {
		res.json("success");
	} else {
		res.json("error");
	}
}
