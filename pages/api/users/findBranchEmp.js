import dbConnect from "../../../utilities/dbConnect";
// import Branch from "../../../schemas/branch";
import EmployeeInfo from "../../../schemas/employeeInfo";

export default async function findBranchEmp(req, res) { 
    dbConnect();    

    let branchID = await EmployeeInfo.findOne({userID: req.query.value}, {branchID: 1});

    // console.log("this is: " + req.query.value)
    // console.log("received is" + branchID)

    if (branchID == null){
        console.log("Cannot find ID");
    }
    else {
        console.log("Branch Found");
    }

    res.json(branchID)

    
}
