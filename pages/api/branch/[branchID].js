import dbConnect from "../../../utilities/dbConnect";
import Branch from "../../../schemas/branch";

export default async function RedeemPawnTicket(req, res) {
  dbConnect();

  let branchInfo = await Branch.findOne({
    branchID: req.query.branchID,
  });
  if (branchInfo == null) {
    console.log("Cannot find Branch");
  } else {
    console.log("branch found");
  }

  res.json(branchInfo);
}
