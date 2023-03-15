import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import User from "../../../schemas/user";
import generateUserID from "../../../utilities/generateUserID";
import RepresentativeInfo from "../../../schemas/representativeInfo";
import Item from "../../../schemas/item";
import EmployeeInfo from "../../../schemas/employeeInfo";

export default async function newClerkRedeem(req,res){
   await dbConnect();
    //console.log("LOL")
    let body = JSON.parse(req.body);

    let branchInfo = await EmployeeInfo.findOne({ userID: body.clerkID });

    let branchManagers = await User.find({
        role: "manager",
        isDisabled : false,
    }).lean();
    
    body.redeemArray.map(async (redeem) => { 
        let result = await Item.updateOne(
            {itemID: redeem.itemID},
            {
            isRedeemed: true
            }
        );

        if (result.modifiedCount != 0)
            console.log("Updated the thing")
    })

    let managerID;

    branchManagers.map(async (branchManager) => {
        let temp = await EmployeeInfo.findOne({
            userID: branchManager.userID,
            branchID: branchInfo.branchID
        });

        if (temp){
            managerID = branchManager.userID;
        }
    })

    let newTransaction = await Transaction.create({
        customerID: body.userID,
        branchID: branchInfo.branchID,
        clerkID: body.clerkID,
        managerID: managerID,
        itemListID: body.itemListID,
        transactionType: "redeem",
        status: "Pending",
        creationDate: new Date(),
        rejectMessage: "",
        amountPaid: 0,
    })
    console.log(JSON.stringify(newTransaction))
    if (newTransaction){
        res.json("redeem posted successfully")
    }
    else{
        res.json("error")
    }
}