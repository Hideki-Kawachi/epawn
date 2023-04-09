import dbConnect from "../../../../utilities/dbConnect";
import Item from "../../../../schemas/item";
import PawnTicket from "../../../../schemas/pawnTicket";
import Transaction from "../../../../schemas/transaction";

export default async function ItemListID(req, res) {
  dbConnect();
  // if (req.query.itemListID != "N/A") {
  //   let pawnInfo = await PawnTicket.findOne({
  //     itemListID: req.query.itemListID,
  //   })
  //     .sort({ loanDate: 1 })
  //     .lean();
  //   console.log("Pawn info is" + pawnInfo)
  //   if (pawnInfo == null) {
  //     console.log("Can't find original PT");
  //   } else {
  //     console.log("Found original PT");
  //   }

  //   res.json(pawnInfo);
  // } else {
  //   res.json(null);
  // } //console.log("Invalid query " + req.query.itemListID);
  let partialPayment = 0;

  if (req.query.itemListID != "N/A"){
    let transacInfo = await Transaction.find({
      itemListID: req.query.itemListID,
      status: { $in: ["Approved", "Done"] },
      transactionType: { $in: ["Renew", "Renew (Online)"] },
    });
  
    if (transacInfo == null){
      console.log("Can't find transaction amounts to compute partial payments");
      res.json(null)
    }
    else{
      console.log("Transac info are: " + JSON.stringify(transacInfo));
      	for (const transac of transacInfo) {
            let pawnTicket = await PawnTicket.findOne({
              transactionID : transac._id
            })

            let interest = pawnTicket.loanAmount * 0.035 * monthDiff(new Date(pawnTicket.maturityDate), new Date());
            let penalties = pawnTicket.loanAmount * 0.01 * monthDiff(new Date(pawnTicket.expiryDate), new Date());

            let amountLeftFromCash = transac.amountPaid - interest - penalties

            partialPayment += ((amountLeftFromCash - pawnTicket.loanAmount * 0.035) )
          }
      res.json(partialPayment)
    }
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
