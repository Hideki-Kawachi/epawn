import Close from "../closebutton";
import { useState, useEffect } from "react";

function AuthorizedRepDetails({trigger, setTrigger, redeemer, authRep}) {



  function closeModal() {
    setTrigger(!trigger);
    // console.log("Auth scanned is now: " + scanned);
  }

  return (
    <>
      <div id="modal-content-area">
        <div className="bg-gray-100 border-2 rounded-xl px-10 pb-10 pt-10 min-w-fit">
          <div className="ml-[650px] mb-5" onClick={closeModal}>
            <Close />
          </div>

          <p className="font-nunito text-base text-center">
            Details of <b> Authorized Representative </b>
          </p>
          <div className="flex flex-row font-nunito text-sm ml-24">
            <div className="font-bold text-right mt-5">
              <p className="mb-3">Full Name: </p>
              <p className="mb-3">Valid ID: </p>
              <p className="mb-3">Scanned Authorization: </p>
            </div>
            <div className="ml-5 text-left mt-5">
              <p className="mb-3 mr-3.5">
                {redeemer.firstName +
                  " " +
                  redeemer.middleName +
                  " " +
                  redeemer.lastName}{" "}
              </p>
              <p className="mb-3 mr-3.5">
                <a
                  className="block font-semibold text-left text-green-500 hover:underline hover:text-green-400 hover:cursor-pointer"
                  href={authRep.validID}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Valid ID
                </a>
              </p>
              <a
                className="block font-semibold text-right text-green-500 hover:underline hover:text-green-400 hover:cursor-pointer"
                href={authRep.authorization}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Proof of Authorization
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AuthorizedRepDetails;
