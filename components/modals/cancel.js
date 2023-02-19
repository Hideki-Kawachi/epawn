import React from "react";
import Close from "../closebutton";
import {useRouter} from "next/router";
export const Cancel = ({ trigger, setTrigger }) => {
const router = useRouter()
  function closeModal() {
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
            Are you sure you want to cancel <b> Redemption</b> of <br />
            <b>Pawn Ticket A-123456</b>? <br /> <br />
            All unsubmitted data will be lost.
          </p>
          <button
            className="bg-green-300 text-base px-24 mt-10 mx-5"
            onClick={closeModal}
          >
            Back
          </button>
          <button
            className="bg-red-300 text-base px-24 mt-10 mx-5"
            onClick={() => router.push("/")}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default Cancel;
