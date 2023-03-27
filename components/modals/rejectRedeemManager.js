import { useRouter } from "next/router";
import React, { useState } from "react";
import Close from "../closebutton";

function RejectRedeemManager({ trigger, setTrigger, transactionID }) {
  const [rejectionMessage, setRejectionMessage] = useState("");
  const router = useRouter();

  function closeModal() {
    setTrigger(!trigger);
  }

  function submitReject() {
    // fetch("/api/pawn/rejectPawn", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     transactionID: transactionID,
    //     rejectionMessage: rejectionMessage,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log("reject data is:", data);
    //     router.replace("/");
    //   });
    console.log("hello")
  }
  return (
    <>
      <div id="modal-content-area">
        <div className="flex flex-col items-center justify-center px-20 pt-10 pb-10 bg-gray-100 border-2 rounded-xl min-w-fit">
          <div className="ml-[615px] mb-5" onClick={closeModal}>
            <Close />
          </div>
          <b className="mb-4 text-base text-center font-nunito">
            What is the reason for rejecting this redemption?
          </b>
          <textarea
            className="w-full h-40 p-2 text-base border-2 font-dosis"
            value={rejectionMessage}
            onChange={(e) => setRejectionMessage(e.target.value)}
          ></textarea>
          <div className="flex gap-10 mt-10">
            <button
              className="px-24 text-base bg-green-300"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="px-24 text-base bg-red-300"
              onClick={() => submitReject()}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RejectRedeemManager;
