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
	dbConnect();

	let body = JSON.parse(req.body);

	let transac = await Transaction.findOneAndUpdate(
		{ _id: body.transactionID },
		{
			amountPaid: body.totalAmount,
			status: "Approved",
		}
	);

	//Creation of Pawn Ticket

	let pawnTicketInfo = await Branch.findOne(
		{ branchID: body.branchID },
		{ currentPawnTicketID: 1, endingPawnTicketID: 1 }
	);

	let loanDate = new Date();
	let newPawnTicketID = pawnTicketInfo.currentPawnTicketID;
	console.log("BRANCH PT IS:" + newPawnTicketID);
	let pawnTicketID = await generatePawnTicketID(newPawnTicketID);
	console.log("GENERATED PT ID IS:", pawnTicketID);
	let newPT = null;

	// check if pawnticket already exists with PT Number
	let pawnTicketExists = await PawnTicket.find({
		transactionID: body.transactionID,
		pawnTicketID: pawnTicketID,
	}).lean();

	if (pawnTicketExists.length == 0) {
		newPT = await PawnTicket.create({
			pawnTicketID: pawnTicketID,
			transactionID: body.transactionID,
			customerID: body.customerID,
			itemListID: body.itemListID,
			loanDate: loanDate,
			maturityDate: new Date().setDate(loanDate.getDate() + 30),
			expiryDate: new Date().setDate(loanDate.getDate() + 120),
			loanAmount: parseFloat(body.newLoanAmount.toFixed(2)),
			isInactive: false,
		});
		console.log("PT AFTER CREATE IS:", newPT);
	} else {
		res.json("error newPT already exists");
	}

	if (newPT) {
		await Branch.findOneAndUpdate(
			{ branchID: body.branchID },
			{ currentPawnTicketID: pawnTicketID }
		);
	}


	let oldPT = await PawnTicket.findOneAndUpdate(
		{ pawnTicketID: body.oldPawnTicket },
		{ isInactive: true }
	);

	let updateRedeem = await Redeem.findOneAndUpdate(
		{ transactionID: body.transactionID },
		{
			newPawnTicketID: pawnTicketID,
		}
	);

	body.redeemArray.map(async (redeem) => {
		let result = await Item.updateOne(
			{ itemID: redeem.itemID },
			{
				redeemID: body.redeemID,
				isRedeemed: true,
        updatedAt: new Date()
			}
		);
		if (result.modifiedCount != 0) console.log("Updated the item");
		else res.json("error");
	});

  let newLoanAmount = Number(body.newLoanAmount.toFixed(2));

	let customerInfo = await CustomerInfo.findOne({ userID: body.customerID });
  let userInfo = await User.findOne({ userID: body.customerID });
  console.log("transac:", transac);
  console.log("updaterRedeem:", updateRedeem);
  console.log("oldPT:", oldPT);
  console.log("newPT:", newPT);
  console.log("userInfo:", userInfo);
  if (transac && updateRedeem && oldPT && newPT) {
    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
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

    let sumWords = toWords.convert(transac.amountPaid, {
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
    let receiptData = []

     receiptData = {
        date: dayjs(new Date()).format("MMM DD, YYYY"),
        customerName: customerName,
        address: customerInfo.presentAddress,
        pawnTicketID: newPT.pawnTicketID,
        principal: (transac.amountPaid - totalInterest).toFixed(2),
        interest: totalInterest.toFixed(2),
        total: transac.amountPaid.toFixed(2),
        totalWords: sumWords,
      };
    
    let pawnTicketPrint = [];

    let itemList = await Item.find({
      itemListID: newPT.itemListID,
      isRedeemed: false,
    }).lean();
    let itemDescription = "";
    let appraisalVal = 0;
    itemList.forEach((item, index) => {
      let tempString = "";
      if (index != itemList.length - 1) {
        tempString = item.itemName + " " + item.weight + " grams, ";
      } else {
        tempString = item.itemName + " " + item.weight + " grams";
      }
      appraisalVal += item.price;
      itemDescription = itemDescription.concat(tempString);
    });

    pawnTicketPrint.push({
      pawnTicketID: newPT.pawnTicketID,
      customerName: customerName,
      address: customerInfo.presentAddress,
      appraisalValue: appraisalVal.toFixed(2),
      loanDate: dayjs(newPT.loanDate).format("MMMM DD,YYYY"),
      maturityDate: dayjs(newPT.maturityDate).format("MMMM DD,YYYY"),
      expiryDate: dayjs(newPT.expiryDate).format("MMMM DD,YYYY"),
      itemDescription: itemDescription,
      loanAmount: newPT.loanAmount.toFixed(2),
      interest: advInterest.toFixed(2),
      netProceeds: (newPT.loanAmount - advInterest).toFixed(2),
      clerkID: transac.clerkID,
    });

  
    res.json({
      receiptData: receiptData,
      pawnTicketData: pawnTicketPrint,
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