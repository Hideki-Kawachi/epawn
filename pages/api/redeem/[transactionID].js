import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";

export default async function TransactionID(req, res) { 
    dbConnect();    
    if(req.query.transactionID != "N/A"){

        let transactionInfo = await Transaction.findOne({transactionID: req.query.transactionID,});
        if (transactionInfo == null){
            console.log("Cannot find Transaction");
        }
        else {
            console.log("Transaction found");
        }
        res.json(transactionInfo)
    }
    else    
    res.json(null)
    
}
