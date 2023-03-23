import dbConnect from "../../../../utilities/dbConnect";
import Item from "../../../../schemas/item";
import PawnTicket from "../../../../schemas/pawnTicket";

export default async function ItemListID(req, res) {
  dbConnect();
  if (req.query.itemListID != "N/A") {
    let pawnInfo = await PawnTicket.findOne({
      itemListID: req.query.itemListID,
    })
      .sort({ loanDate: 1 })
      .exec();

    if (pawnInfo == null) {
      console.log("Can't find original PT");
    } else {
      console.log("Found original PT");
    }

    res.json(pawnInfo);
  } else {
    res.json(null);
  } //console.log("Invalid query " + req.query.itemListID);
}
