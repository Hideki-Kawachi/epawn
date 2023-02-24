import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import PawnDetails
 from "./modals/pawnDetails";
function ItemCard({itemName, itemType, itemPrice}) {
  const [pawnModal, setPawnOpen] = useState(false); //View Pawn Item Detials
  const [defaultName, setName]= useState();
  const [defaultType, setType] = useState();
  const [defaultPrice, setPrice] = useState();

  function viewDetails(){
    setPawnOpen(true)
  }
  
  function setDefault(){
    if(itemName == null)
      setName("Default Item");
    else
      setName(itemName)
    
    if (itemType ==  null)
      setType("Default Watch")
    else
      setType(itemType)

    if (itemPrice == null)
      setPrice("Php Morbillion")
    else
      setPrice(itemPrice)
  }

  useEffect (()=>{
    let ignore = false;
    if(!ignore) setDefault()
    return () => { ignore = true; }
  });

  return (
    <div className="bg-light shadow-md flex font-nunito rounded-lg h-fit m-5">
      <Modal isOpen={pawnModal} ariaHideApp={false} className="modal">
        <PawnDetails
          trigger={pawnModal}
          setTrigger={setPawnOpen}
          itemName={itemName}
          itemType={itemType}
          itemPrice={itemPrice}
        />
      </Modal>

      <div className="m-5 w-96">
        <p>
          <b>Name: </b>
          {defaultName}
        </p>
        <p>
          <b>Type: </b>
          {defaultType}
        </p>
        <p>
          <b>Price: </b>
          {defaultPrice}
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
