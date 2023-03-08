import React from "react";
import Close from "../closebutton";

function PawnDetails({trigger, setTrigger, itemName, itemType, itemPrice, itemID}) {

    function closeModal() {
      setTrigger(!trigger);
    }

    return (
      <>
        <div id="modal-content-area">
          <div className="bg-gray-100 border-2 rounded-xl px-20 pb-10 pt-5 min-w-fit">
            <div className="ml-[615px] " onClick={closeModal}>
              <Close />
            </div>
            <div>
              <p className="font-dosis font-bold text-lg text-center mb-5">
                Item Details
              </p>
            </div>
            <div className="flex flex-row font-nunito text-sm">
              <div className="font-bold text-right">
                <p>Name: </p>
                <p>Type: </p>
                <p>Item ID: </p>
                <p>Image: </p>
                <p>Price: </p>
              </div>
              <div className="ml-5 text-left">
                <p>{itemName}</p>
                <p>{itemType} </p>
                <p>{itemID}</p>
                <p>WatchPic.jpg </p>
                <p>Php {itemPrice}</p>
              </div>
            </div>
            <hr className="h-px my-5 bg-gray-500 border-0" />
            <div className="flex flex-row font-nunito text-sm">
              <div className="text-right">
                <p>Category: </p>
                <p>Weight: </p>
                <p>Color: </p>
                <p>Purity: </p>
                <p>Brand: </p>
                <p>Model: </p>
                <p>Description</p>
              </div>
              <div className="ml-5 text-left">
                <p>Gold</p>
                <p>10.56 g</p>
                <p>Yellow Rose</p>
                <p>90k </p>
                <p>Samsung </p>
                <p>Watching Machine</p>
                <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
              </div>
            </div>
            <hr className="h-px my-5 bg-gray-500 border-0" />
            <div className="flex flex-row font-nunito text-sm">
              <div className="text-right">
                <p className="font-bold">Accessories: </p>
              </div>
              <br/>
              <p className=" ml-10 font-bold text-gray-300">No Accessories</p> 
            </div>
          </div>
        </div>
      </>
    );
}

export default PawnDetails;
