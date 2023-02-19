import React, {useState} from "react";
import Modal from "react-modal";
import PawnDetails
 from "./modals/pawnDetails";
function ItemCard() {
  const [pawnModal, setPawnOpen] = useState(false); //View Pawn Item Detials

  function viewDetails(){
    setPawnOpen(true)
  }
  return (
    <div className="bg-light shadow-md flex font-nunito rounded-lg h-fit m-5">
      <Modal isOpen={pawnModal} ariaHideApp={false} className="modal">
        <PawnDetails trigger={pawnModal} setTrigger={setPawnOpen} />
      </Modal>

      <div className="m-5 w-96">
        <p>
          <b>Name: </b>
          Platinum Ring w/ Certificate
        </p>
        <p>
          <b>Type: </b>
          Ring
        </p>
        <p>
          <b>Price: </b>
          Php 80,000
        </p>
      </div>
      <div className="mt-5 mr-5">
        <button className="bg-green-300 text-white" onClick={viewDetails}>View Details</button>
      </div>
    </div>
  );
}

export default ItemCard;
