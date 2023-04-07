import Transaction from "../../../schemas/transaction";
import dbConnect from "../../../utilities/dbConnect";
import Item from "../../../schemas/item";
import User from "../../../schemas/user";
import RepresentativeInfo from "../../../schemas/representativeInfo";
import Redeem from "../../../schemas/redeem";
import mongoose from "mongoose";

export default async function RejectClerk(req, res) {
  await dbConnect();

  let body = JSON.parse(req.body);

  let items = body.itemList;
  let isOriginal = body.isOriginal
  if (isOriginal == false) {
    let authRep = await RepresentativeInfo.deleteOne({ userID: body.redeemerID });
    if (authRep) {
      let del = await User.deleteOne({ userID: body.redeemerID });
          console.log("RESULT FROM REJECT IS:", authRep);
    }
  } 

  let delRedeem = await Redeem.deleteOne({ redeemID : body.redeemID });

  let delTransac = await Transaction.findByIdAndDelete(
    new mongoose.Types.ObjectId(body.transactionID.toString()))

  for (const item of items) {
    let update = await Item.findOneAndUpdate(
      { itemID: item.itemID },
      { redeemID: "" }
    );
  }

  if(delRedeem && delTransac){

    res.json("success");
  }
  else
    res.json("error in deleting rejected redeem")
}
