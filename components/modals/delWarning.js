import React from "react";
import Close from "../closebutton";
import { useRouter } from "next/router";

export const Delete = ({ trigger, setTrigger, content, trigger2 }) => {
  const router = useRouter();
  function closeModal() {
    setTrigger(!trigger);
  }

  function removeClick(){
    trigger2();
     setTrigger(!trigger);
  }
  return (
    <>
      <div id="modal-content-area">
        <div className="flex flex-col items-center justify-center px-20 pt-10 pb-10 bg-gray-100 border-2 rounded-xl min-w-fit">
          <div className="ml-[615px] mb-5" onClick={closeModal}>
            <Close />
          </div>
          <p className="text-base text-center font-nunito">
            Are you sure you want to remove <br/> <b>{content}</b><br/>from the redeem
            list?
          </p>
          <div className="flex gap-10 mt-10">
            <button
              className="px-24 text-base bg-green-300"
              onClick={closeModal}
            >
              Back
            </button>
            <button
              className="px-24 text-base bg-red-300"
              onClick={removeClick}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Delete;
