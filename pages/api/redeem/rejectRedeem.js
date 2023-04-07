import Transaction from "../../../schemas/transaction";
import dbConnect from "../../../utilities/dbConnect";
import Item from "../../../schemas/item";
import User from "../../../schemas/user";
import RepresentativeInfo from "../../../schemas/representativeInfo";

export default async function RejectRedeem(req, res) {
  await dbConnect();

  let body = JSON.parse(req.body);
  

  let result = await Transaction.findByIdAndUpdate(body.transactionID, {
    rejectionMessage: body.rejectionMessage,
    status: "Rejected",
  });

  console.log("RESULT FROM REJECT IS:", result);
  if(result)
  res.json("success");
  else
  res.json("error")
}
