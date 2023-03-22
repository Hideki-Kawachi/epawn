import dbConnect from "../../../../utilities/dbConnect";
import Redeem from "../../../../schemas/redeem";

export default async function Renewal(req, res) {
  dbConnect();

  let redeemInfo = await Redeem.findOne({
    transactionID: req.query.transactionID,
  });
  if (redeemInfo == null) {
    console.log("Cannot find redeem");
  } else {
    console.log("redeemInfo found");
  }

  res.json(redeemInfo);
}
