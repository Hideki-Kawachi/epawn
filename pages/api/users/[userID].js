import dbConnect from "../../../utilities/dbConnect";
import User from "../../../schemas/user";

export default async function UserID(req, res) { 
    dbConnect();    

    let userInfo = await User.findOne({userID: req.query.userID,});
    if (userInfo == null){
        console.log("Cannot find User");
    }
    else {
        console.log("User found");
    }

    res.json(userInfo)

    
}
