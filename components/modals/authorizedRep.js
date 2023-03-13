import Close from "../closebutton";
import { useState, useEffect } from "react";

function AuthorizedRep({trigger, setTrigger, authData, setAuth, check}){

  const [fname, setfName] = useState("");
  const [mname, setmName] = useState("");
  const [lname, setlName] = useState("");
  const [scanned, setScanned] = useState([]);
  const [validID, setValidID] = useState([]);
  const [filled, setFilled] = useState(true);
    function closeModal() {
      setTrigger(!trigger);
     // console.log("Auth scanned is now: " + scanned);
    }

    function authorizeFile(data){
      setAuth(data)
    }

    useEffect(() => {
     
      if(authData) {
          setfName(authData[0].fName)
          setmName(authData[0].mName);
          setlName(authData[0].lName);
        //  console.log("Auth scanned is now: " + scanned);
        //   console.log("Auth Data is now: " + JSON.stringify(authData));
      }

      else {
          setfName("");
          setmName("");
          setlName("");
          setScanned([]);
          setValidID([]);
      }
    }, [authData])
  
    useEffect(() => {    

        if (fname != "" && lname != "" && scanned.length != 0 && validID.length != 0)
          setFilled(true);
        else 
          setFilled(false);
    }, [fname, lname, scanned, validID])

  function saveButton(){
    if
    (filled){
      const newAuth = [{
        fName : fname,
        mName : mname,
        lName : lname, 
        scanned : scanned,
        validID : validID
      }];

      authorizeFile(newAuth);
      setTrigger(!trigger);
      setFilled(true);
    }
      else 
      setFilled(false)
  }

  return (
    <>
      <div id="modal-content-area">
        <div className="bg-gray-100 border-2 rounded-xl px-20 pb-10 pt-10 min-w-fit">
          <div className="ml-[650px] mb-5" onClick={closeModal}>
            <Close />
          </div>

          <p className="font-nunito text-base text-center">
            Details of Authorized Representative to <b> redeem PT A-123456</b>
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
                value={fname}
                onChange={(e) => setfName(e.target.value)}
              ></input>
              <input
                type="text"
                className="block mb-2"
                value={mname}
                onChange={(e) => setmName(e.target.value)}
              ></input>
              <input
                type="text"
                className="block mb-2"
                value={lname}
                onChange={(e) => setlName(e.target.value)}
              ></input>
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="block mb-2"
                //value={scanned}
                onChange={(e) => setScanned(e.target.files[0])}
              ></input>
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="block mb-2"
                //value={validID}
                onChange={(e) => setValidID(e.target.files[0])}
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
