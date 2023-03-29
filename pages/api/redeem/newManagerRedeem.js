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

export default async function newManagerRenewal(req, res) {
  dbConnect();

  let body = JSON.parse(req.body);

  let transac = await Transaction.findOneAndUpdate(
    { _id: body.transactionID },
    {
      amountPaid: body.totalAmount,
      status: "Approved"
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
      loanAmount: body.newLoan,
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
            isRedeemed: true
        }
        );
          if (result.modifiedCount != 0) console.log("Updated the item");
          else
          res.json("error")
    });

    if(oldPT && updateRedeem){
        res.json("success")
    }else
        res.json("error")

}