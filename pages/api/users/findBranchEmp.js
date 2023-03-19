import dbConnect from "../../../utilities/dbConnect";
import Branch from "../../../schemas/branch";

export default async function findBranchEmp(req, res) { 
    dbConnect();    

    let branchID = await Branch.findOne({userID: req.query.value,});

    if (branchID == null){
        console.log("Cannot find ID");
    }
    else {
        console.log("Branch Found");
    }

    res.json(branchID)

    
}
