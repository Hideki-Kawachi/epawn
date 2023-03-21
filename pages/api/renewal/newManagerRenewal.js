import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import User from "../../../schemas/user";
import EmployeeInfo from "../../../schemas/employeeInfo";
import Renew from "../../../schemas/renew";
import generateRenewalID from "../../../utilities/generateRenewalID";
import PawnTicket from "../../../schemas/pawnTicket";
import generatePawnTicketID from "../../../utilities/generatePawnTicketID";
import Branch from "../../../schemas/branch";
export default async function newManagerRenewal(req, res) {
  dbConnect();
  //console.log("LOL")

  let body = JSON.parse(req.body);

  let transac = await Transaction.updateOne(
    { _id: body.transactionID },
    {
      transactionType: "Renew",
      status: "Approved",
      // rejectMessage: "",
      // amountPaid: body.totalAmount,
    }
  );

  //console.log("Manager ID is " + managerID);

  //console.log(JSON.stringify(newTransaction))

  // get current and ending pawnticket number for branch
  let pawnTicketInfo = await Branch.findOne(
    { branchID: body.branchID },
    { currentPawnTicketID: 1, endingPawnTicketID: 1 }
  );

  // check if pawnticket already exists with PT Number
  let pawnTicketExists = await PawnTicket.find({
    transactionID: body.transactionID,
    pawnTicketID: { $exists: true },
    $expr: { $gt: [{ $strLenCP: "$pawnTicketID" }, 1] },
  });

  let loanDate = new Date()
  let newPawnTicketID = pawnTicketInfo.currentPawnTicketID;
  console.log("New PT is " + newPawnTicketID)
  let pawnTicketID = await generatePawnTicketID(newPawnTicketID);
  console.log("PT is " + pawnTicketID)
    if (pawnTicketExists.length == 0) {
        await PawnTicket.create({
            pawnTicketID: pawnTicketID,
            transactionID: body.transactionID,
            customerID: body.customerID,
            itemListID: body.itemListID,
            loanDate: loanDate,
            maturityDate: new Date().setDate(loanDate.getDate() + 30),
            expiryDate: new Date().setDate(loanDate.getDate() + 60),
            loanAmount: body.newLoanAmount,
            isInactive: false,
        });
	} 

  let oldPT = await PawnTicket.updateOne({pawnTicketID: body.oldPawnTicket},
    { isInactive: true,
  });

  let renew = await Renew.updateOne(
    { renewID: body.renewID },
    {
      newPawnTicketID: pawnTicketID,
    }
  );

  if (transac && renew && oldPT) {
    res.json("renew posted successfully");
  } else {
    res.json("error");
  }
}
