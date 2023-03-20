import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import User from "../../../schemas/user";
import Item from "../../../schemas/item";
import EmployeeInfo from "../../../schemas/employeeInfo";
import Redeem from "../../../schemas/redeem";
import generateRedeemID from "../../../utilities/generateRedeemID";


export default async function newClerkRedeem(req,res){
    dbConnect();
    //console.log("LOL")
    
    let body = JSON.parse(req.body);

    let branchInfo = await EmployeeInfo.findOne({ userID: body.clerkID });

    let branchManagers = await User.find({
        role: "manager",
        isDisabled : false,
    }).lean();
    
    let managerID;

    // branchManagers.map(async (branchManager) => {
    //     let temp = await EmployeeInfo.findOne({
    //         userID: branchManager.userID,
    //         branchID: branchInfo.branchID
    //     });

    //     if (temp){
    //         managerID = branchManager.userID;
    //        // console.log("Manager ID is " + managerID);
    //     }
    // })

    for (const branchManager of branchManagers) {
      let temp = await EmployeeInfo.findOne({
        userID: branchManager.userID,
        branchID: branchInfo.branchID,
      });

      if (temp) {
        managerID = branchManager.userID;
        break; // exit the loop once a manager is found
      }
    }
    
    let newTransaction = await Transaction.create({
        customerID: body.customerID,
        branchID: branchInfo.branchID,
        clerkID: body.clerkID,
        managerID: managerID,
        itemListID: body.itemListID,
        transactionType: "Redeem",
        status: "Pending",
        creationDate: new Date(),
        rejectMessage: "",
        amountPaid: 0,
      
    })

    console.log("Manager ID is " + managerID);


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


    //console.log(JSON.stringify(newTransaction))
    
    let redeemID = await generateRedeemID();

    let newRedeem = await Redeem.create({
        redeemID: redeemID,

        transactionID: "ObjectId('" + newTransaction._id + "')",
        pawnTicketID: body.pawnTicketID,
        payment: body.totalAmount,
        redeemerID: body.customerID,
        redeemDate: new Date(),
    })

        body.redeemArray.map(async (redeem) => {
          let result = await Item.updateOne(
            { itemID: redeem.itemID },
            {
              isRedeemed: true,
              transactionID: "ObjectId('" + newRedeem.transactionID + "')",
              redeemID: redeemID,
            }
          );
          if (result.modifiedCount != 0) console.log("Updated the item");
        });


    if (newTransaction && newRedeem){
        res.json("redeem posted successfully")
    }
    else{
        res.json("error")
    }
}