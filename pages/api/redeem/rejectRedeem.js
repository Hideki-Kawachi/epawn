import Transaction from "../../../schemas/transaction";
import dbConnect from "../../../utilities/dbConnect";
import Item from "../../../schemas/item";
import User from "../../../schemas/user";
import RepresentativeInfo from "../../../schemas/representativeInfo";

export default async function RejectRedeem(req, res) {
  await dbConnect();

  let body = JSON.parse(req.body);
  let items = body.itemList;
  console.log(items);
  let result = await Transaction.findByIdAndUpdate(body.transactionID, {
    rejectionMessage: body.rejectionMessage,
    status: "Rejected",
  });

  for (const item of items){
    let update = await Item.findOneAndUpdate(
      {itemID: item.itemID}, 
      {redeemID: ""})
  }
  
  if(!isOriginal){
    let authRep = await RepresentativeInfo.deleteOne({ userID : body.userID})
    if(authRep){
      let user = await User.deleteOne({ userID: body.userID });
    }
  }

  console.log("RESULT FROM REJECT IS:", result);
  res.json("success");
}
