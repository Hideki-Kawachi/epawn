import dbConnect from "../../utilities/dbConnect";
import Branch from "../../schemas/branch";

export default async function editBranchInfo(req, res) { 
    dbConnect();    

    const branchInfo = req.body;

    let branchID = await Branch.updateOne({branchID: branchInfo.branchID}, 
        {
            currentPawnTicketID: branchInfo.currentPawnTicketID,
            endingPawnTicketID: branchInfo.endingPawnTicketID
        });

    if (branchID == null){
        console.log("Cannot find ID");
    }
    else {
        console.log("Branch Found");
    }

    res.json(branchID)

    
}
