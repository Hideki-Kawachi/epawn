import Transaction from "../../../schemas/transaction";
import dbConnect from "../../../utilities/dbConnect";
import Item from "../../../schemas/item";
import User from "../../../schemas/user";
import RepresentativeInfo from "../../../schemas/representativeInfo";

export default async function RejectClerk(req, res) {
  await dbConnect();

  let body = JSON.parse(req.body);
 

  if (!isOriginal) {
    let authRep = await RepresentativeInfo.deleteOne({ userID: body.userID });
    if (authRep) {
      let user = await User.deleteOne({ userID: body.userID });
    }
  }
  
  console.log("RESULT FROM REJECT IS:", authRep);
  res.json("success");
}
