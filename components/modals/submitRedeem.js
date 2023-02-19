import React from "react";
import Close from "../closebutton";
import ItemCard from "../itemcard";
export const Submit = ({trigger, setTrigger}) => {

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
          <p className="font-nunito text-base text-center">
            Are you sure you want to continue with the <b> Redemption</b> of{" "}
            <br />
            <b>Pawn Ticket A-123456</b> of items:{" "}
          </p>
          <ItemCard/>
          <ItemCard/>

          <p className="text-center text-base">
            For a total of <b>Php 69,420.00</b>
          </p>
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
