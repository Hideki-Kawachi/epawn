import React, {useState} from "react";
import Modal from "react-modal";
import PawnDetails
 from "./modals/pawnDetails";
function ItemCard({itemID, itemName, itemType, itemPrice}) {
  const [pawnModal, setPawnOpen] = useState(false); //View Pawn Item Detials


  function viewDetails(){
    setPawnOpen(true)
  }
  
  function convertFloat(number){
    return Number(number).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="bg-light shadow-md flex font-nunito rounded-lg h-fit m-5">
      <Modal isOpen={pawnModal} ariaHideApp={false} className="modal">
        <PawnDetails
          trigger={pawnModal}
          setTrigger={setPawnOpen}
          itemName={itemName}
          itemType={itemType}
          itemPrice={convertFloat(itemPrice)}
          itemID={itemID}
        />
      </Modal>

      <div className="m-5 w-96">
        <p>
          <b>Name: </b>
          {itemName}
        </p>
        <p>
          <b>ID: </b>
          {itemID}
        </p>
        <p>
          <b>Type: </b>
          {itemType}
        </p>
        <p>
          <b>Price: </b>
          Php {convertFloat(itemPrice)}
        </p>
      </div>
      <div className="mt-5 mr-5">
        <button className="bg-green-300 text-white" onClick={viewDetails}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default ItemCard;
