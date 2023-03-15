import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import User from "../../../schemas/user";
import generateUserID from "../../../utilities/generateUserID";
import RepresentativeInfo from "../../../schemas/representativeInfo";
import Item from "../../../schemas/item";

export default async function newRepresentative(req, res) {
  await dbConnect();

  let body = JSON.parse(req.body);

  let userID = await generateUserID();

  let user = await User.create({
    userID: userID,
    role : "customer",
    firstName: body.firstName,
    middleName: body.middleName,
    lastName: body.lastName,
  });

  let representativeInfo = await RepresentativeInfo.create({
    userID: userID,
    authorization: body.authorization,
    validID: body.validID,
  })

  console.log("RepInfo is:" + representativeInfo)

  if (representativeInfo)
      res.json("RepInfo is successfully added");
  else
      res.json("RepInfo not added");

}
