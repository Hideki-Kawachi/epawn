import React from "react";
import Close from "../closebutton";
import ItemCard from "../itemcard";
export const Submit = ({trigger, setTrigger, mode, PTnumber, itemList}) => {

    function closeModal(){
        setTrigger(!trigger);
    }

  return (
    <>
      <div id="modal-content-area">
        <div className="bg-gray-100 border-2 rounded-xl px-20 pb-10 pt-10 min-w-fit">
          <div className="ml-[615px] mb-5" onClick={closeModal}>
            <Close />
          </div>
        {mode == "search" ? (
          <p className="font-nunito text-base text-center mb-5">
            Select  <b>Pawn Ticket {PTnumber}</b> <br/> with the following items? 
          </p>
          ): ( 
            <p className="font-nunito text-base text-center mb-5">
            Are you sure you want to continue with the <b> Redemption</b> of{" "}
            <br />
            <b>Pawn Ticket {PTnumber}</b> of items:{" "}
          </p>

          )}
            <div className="p-5 mx-10 w-[720px] h-96  overflow-y-scroll bg-white border-2">
              {itemList.map((items) => (
                <div className="flex flex-row" key={items.ItemID}>
                  <ItemCard
                    key={items.ItemID}
                    itemID={items.ItemID}
                    itemName={items.Name}
                    itemType={items.Type}
                    itemPrice={items.Price}
                  ></ItemCard>
                </div>
              ))}
            </div>
          {mode == "select" ? (
          <p className="text-center text-base">
            For a total of <b>Php 69,420.00</b>
          </p>
          ) :( <> </>)}
          <button
            className="bg-red-300 text-base px-24 mt-5 mx-5"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button className="bg-green-300 text-base px-24 mt-5 mx-5">
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default Submit;
