import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import mongoose from "mongoose";
export default async function TransactionID(req, res) { 
    dbConnect();    
    if(req.query.transactionID.length >= 24  ){
        let transactionInfo = await Transaction.findOne({_id: req.query.transactionID});

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
