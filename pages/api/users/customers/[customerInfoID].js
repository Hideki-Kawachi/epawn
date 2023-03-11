import dbConnect from "../../../../utilities/dbConnect";
import CustomerInfo from "../../../../schemas/customerInfo";

export default async function UserID(req, res) { 
    dbConnect();    

    let customerInfo = await CustomerInfo.findOne({userID: req.query.userID});
    if (customerInfo == null){
        console.log("Cannot find Customer");
    }
    else {
        console.log("Customer found");
    }

    res.json(customerInfo)

    
}
