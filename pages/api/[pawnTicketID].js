import dbConnect from "../../utilities/dbConnect";
import PawnTicket from "../../schemas/pawnTicket";

export default async function RedeemPawnTicket(req, res) { 
    dbConnect();    

    let pawnInfo = await PawnTicket.findOne({pawnTicketID: req.query.pawnTicketID,});
    if (pawnInfo == null){
        console.log("Cannot find Pawn Ticket");
    }
    else {
        console.log("pawn ticket found");
    }

    res.json(pawnInfo)

    
}
