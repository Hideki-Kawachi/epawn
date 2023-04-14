import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import User from "../../../schemas/user";
import EmployeeInfo from "../../../schemas/employeeInfo";
import Redeem from "../../../schemas/redeem";
import generateRenewalID from "../../../utilities/generateRenewalID";
import PawnTicket from "../../../schemas/pawnTicket";
import generatePawnTicketID from "../../../utilities/generatePawnTicketID";
import Branch from "../../../schemas/branch";
import CustomerInfo from "../../../schemas/customerInfo";
import dayjs from "dayjs";
import { ToWords } from "to-words";
import Item from "../../../schemas/item";

export default async function newManagerRedeem(req, res) {
	//API to use if all items will be redeemed
	dbConnect();

	let body = JSON.parse(req.body);

	let transac = await Transaction.findOneAndUpdate(
		{ _id: body.transactionID },
		{
			amountPaid: body.totalAmount,
			status: "Done",
		}
	);

	let pawnTicketInfo = await Branch.findOne(
		{ branchID: body.branchID },
		{ currentPawnTicketID: 1, endingPawnTicketID: 1 }
	);

	let oldPT = await PawnTicket.findOneAndUpdate(
		{ pawnTicketID: body.oldPawnTicket },
		{   transactionID : body.transactionID,
			isInactive: true }
	);

	body.redeemArray.map(async (redeem) => {
		let result = await Item.updateOne(
			{ itemID: redeem.itemID },
			{
				redeemID: body.redeemID,
				isRedeemed: true,
				updatedAt: new Date(),
			}
		);
		if (result.modifiedCount != 0) console.log("Updated the item");
		else res.json("error");
	});
	let newLoanAmount = Number(body.newLoanAmount.toFixed(2));

	let customerInfo = await CustomerInfo.findOne({ userID: body.customerID });
	let userInfo = await User.findOne({ userID: body.customerID });
	console.log("transac:", transac);
	console.log("oldPT:", oldPT);
	console.log("userInfo:", userInfo);
	if (transac && oldPT) {
		const toWords = new ToWords({
			localeCode: "en-US",
			converterOptions: {
				currency: true,
				ignoreDecimal: false,
				ignoreZeroCurrency: true,
				doNotAddOnly: false,
				currencyOptions: {
					// can be used to override defaults for the selected locale
					name: "Peso",
					plural: "Pesos",
					symbol: "₱",
					fractionalUnit: {
						name: "Cent",
						plural: "Cents",
						symbol: "",
					},
				},
			},
		});

		let sumWords = toWords.convert(body.totalAmount, {
      currency: true,
      ignoreZeroCurrency: true,
    });
		let customerName = String(
			userInfo.firstName + " " + userInfo.middleName + " " + userInfo.lastName
		);
		let advInterest = newLoanAmount * 0.035;
		let interest =
			oldPT.loanAmount *
			0.035 *
			monthDiff(new Date(oldPT.maturityDate), new Date());
		let penalties =
			oldPT.loanAmount *
			0.01 *
			monthDiff(new Date(oldPT.expiryDate), new Date());
		let totalInterest = advInterest + interest + penalties;
		let receiptData = [];

		receiptData = {
      date: dayjs(new Date()).format("MMM DD, YYYY"),
      customerName: customerName,
      address: customerInfo.presentAddress,
      pawnTicketID: "N/A",
      principal: (body.totalAmount - totalInterest).toFixed(2),
      interest: totalInterest.toFixed(2),
      total: body.totalAmount.toFixed(2),
      totalWords: sumWords,
    };
		res.json({
			receiptData: receiptData,
		});
	} else {
		res.json("error");
	}
}

function monthDiff(dateFrom, dateTo) {
	let diff =
		dateTo.getMonth() -
		dateFrom.getMonth() +
		12 * (dateTo.getFullYear() - dateFrom.getFullYear());
	console.log("diff is:", diff);
	if (diff > 0) {
		return diff;
	} else {
		return 0;
	}
}
