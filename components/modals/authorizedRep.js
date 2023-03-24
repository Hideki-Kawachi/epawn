import Close from "../closebutton";
import { useState, useEffect } from "react";

function AuthorizedRep({
  trigger,
  setTrigger,
  authRep,
  setAuthRep,
  authRepID,
  setAuthRepID,
  authStatus,
  setAuthStatus,
  authProof,
  setAuthProof,
}) {

  const [filled, setFilled] = useState(true);
  const [fName, setfName] = useState("")
  const [mName, setmName] = useState("")
  const [lName, setlName] = useState("")

  function closeModal() {
    setTrigger(!trigger);
    // console.log("Auth scanned is now: " + scanned);
  }


  useEffect(() => {
    if (fName != "" && lName != "" && authRepID && authProof)
      setFilled(true);
    else setFilled(false);
  }, [fName, lName, authRepID, authProof]);

  function saveButton() {
    if (filled) {
      setAuthRep([{ fName: fName, mName: mName, lName: lName }]);
      setAuthStatus(true);
      setTrigger(!trigger);
      setFilled(true);
    } else 
    setFilled(false);
  }

  return (
    <>
      <div id="modal-content-area">
        <div className="bg-gray-100 border-2 rounded-xl px-20 pb-10 pt-10 min-w-fit">
          <div className="ml-[650px] mb-5" onClick={closeModal}>
            <Close />
          </div>

          <p className="font-nunito text-base text-center">
            Details of Authorized Representative to <b> redeem</b>
          </p>
          <div className="flex flex-row font-nunito text-sm">
            <div className="font-bold text-right mt-5">
              <p className="mb-3">
                First Name: <span className="text-red-500">*</span>
              </p>
              <p className="mb-3 mr-3.5">Middle Name:</p>
              <p className="mb-3">
                Last Name: <span className="text-red-500">*</span>
              </p>
              <p className="mb-3">
                Valid ID: <span className="text-red-500">*</span>{" "}
              </p>
              <p className="mb-3">
                Scanned Authorization: <span className="text-red-500">*</span>
              </p>
            </div>
            <div className="ml-5 text-left mt-5">
              <input
                type="text"
                className="block mb-2"
                value={fName}
                onChange={(e) => setfName(e.target.value)}
              ></input>
              <input
                type="text"
                value={mName}
                className="block mb-2"
                onChange={(e) => setmName(e.target.value)}
              ></input>
              <input
                type="text"
                className="block mb-2"
                value={lName}
                onChange={(e) => setlName(e.target.value)}
              ></input>
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="block mb-2"
                //value={scanned}
                onChange={(e) => setAuthRepID(e.target.files[0])}
              ></input>
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="block mb-2"
                //value={validID}
                onChange={(e) => setAuthProof(e.target.files[0])}
              ></input>{" "}
              <p className="text-gray-300">
                {" "}
                only accepts .png and .jpeg files
              </p>
              <p className="text-gray-300"> Max file size: 5 MB</p>
            </div>
          </div>

          {/* Buttons */}
          <div className=" flex flex-row">
            <div className="">
              {" "}
              <p className="font-nunito text-sm mt-10">
                All fields marked with <span className="text-red-500">* </span>
                are required.{" "}
              </p>
              {filled == false ? (
                <p className="font-nunito text-sm ">
                  Some <b>required fields</b> are still empty.
                </p>
              ) : (
                <></>
              )}
            </div>
            <div className=" ml-20 ">
              <button
                className="bg-red-300 text-base px-8 mt-10 mx-2"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-300 text-base px-10 mt-10 mx-2"
                onClick={saveButton}
                disabled={!filled}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AuthorizedRep;
