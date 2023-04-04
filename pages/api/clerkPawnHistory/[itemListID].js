import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import Branch from "../../../schemas/branch";
import PawnTicket from "../../../schemas/pawnTicket";
import dayjs from "dayjs";
export default async function PawnHistory(req, res) {
  dbConnect();

  let pawnTicketData = await PawnTicket.find({
    itemListID: req.query.itemListID,
  }).sort({loanDate: -1});

  let pawnHistory = []

  for(let ticket of pawnTicketData){
    let transaction = await Transaction.findOne({
      _id: ticket.transactionID,
      status: "Done" || "Approved"
    })

    let branch = await Branch.findOne({
      branchID : transaction.branchID
    })

    let amountPaid = 0

    if (transaction.amountPaid > 0 ){
      amountPaid = transaction.amountPaid
    }
    else 
      amountPaid = 0

    if (branch && transaction){
        pawnHistory.push({
          pawnTicketID: ticket.pawnTicketID,
          transactionType: transaction.transactionType,
          branchID : branch.branchName,
          loanDate: dayjs(ticket.loanDate).format('MM/DD/YYYY'),
        
          amountPaid : "Php " + amountPaid.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            }),
          loanAmount : "Php " + ticket.loanAmount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            })
        })
    }
  }
  if(pawnHistory.length > 0){
  res.json(JSON.parse(JSON.stringify(pawnHistory)));
}
  else {
    res.json("error");
  }
}
