import dbConnect from "../../../utilities/dbConnect";
import Renew from "../../../schemas/renew";


export default async function Renewal(req, res) {
  dbConnect();

  let renewInfo = await Renew.findOne({
    transactionID: req.query.transactionID,
  });
  if (renewInfo == null) {
    console.log("Cannot find renew");
  } else {
    console.log("renew found");
  }

  res.json(renewInfo);
}
