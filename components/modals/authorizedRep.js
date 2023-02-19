import Close from "../closebutton";

function AuthorizedRep({trigger, setTrigger}){
    function closeModal() {
      setTrigger(!trigger);
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
              <p className="mb-3">
                Last Name: <span className="text-red-500">*</span>
              </p>
              <p className="mb-3">
                Middle Name: <span className="text-red-500">*</span>
              </p>
              <p className="mb-3">
                Valid ID: <span className="text-red-500">*</span>{" "}
              </p>
              <p className="mb-3">
                Scanned Authorization: <span className="text-red-500">*</span>
              </p>
            </div>
            <div className="ml-5 text-left mt-5">
              <input type="text" className="block mb-2"></input>
              <input type="text" className="block mb-2"></input>
              <input type="text" className="block mb-2"></input>
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="block mb-2"
              ></input>
              
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="block mb-2"
              ></input> <span type="button" className="inline bg-gray-500 h-5 w-5 text-center font-bold text-white rounded-full ">i</span>
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
            </div>
            <div className=" ml-20 ">
              <button
                className="bg-red-300 text-base px-8 mt-10 mx-2"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button className="bg-green-300 text-base px-10 mt-10 mx-2">
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
