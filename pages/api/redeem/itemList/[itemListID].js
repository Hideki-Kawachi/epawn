import dbConnect from "../../../../utilities/dbConnect";
import Item from "../../../../schemas/item";

export default async function ItemListID(req, res) { 
    dbConnect();    
    if(req.query.itemListID != "N/A"){
        let itemInfo = await Item.find({itemListID: req.query.itemListID,});
        if (itemInfo == null){
            console.log("Cannot find items");
        }
        else {
            console.log("Item(s) found");
        }

        res.json(itemInfo)
        }
    else
    res.json(null)
    
}
