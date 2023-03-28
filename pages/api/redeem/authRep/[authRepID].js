import dbConnect from "../../../../utilities/dbConnect";
import RepresentativeInfo from "../../../../schemas/representativeInfo";
import mongoose from "mongoose";

export default async function AuthRep(req, res) {
  dbConnect();

    let repInfo = await RepresentativeInfo.findOne({
      userID: req.query.authRepID,
    });

    if (repInfo == null) {
      console.log("Cannot find authrep");
    } else {
      console.log("auth rep found");
    }
    res.json(repInfo);

} 
