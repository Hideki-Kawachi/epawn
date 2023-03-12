import Close from "../closebutton";
import Image from "next/image";
function CustomerDetails({ trigger, setTrigger, customerInfo, userInfo}) {
  function closeModal() {
    setTrigger(!trigger);
  }
  return (
    <>
      <div id="modal-content-area">
        {/* Modal Window */}
        <div className="bg-gray-100 flex flex-col border-2 rounded-xl px-5 py-5 min-w-fit">
          {/* Close Button Row */}
          <div className="ml-[680px] mb-5" onClick={closeModal}>
            <Close />
          </div>

          {/* Header Row Start */}
          <div className="header flex border-2 border-b-0 flex-row bg-green-50 p-5 rounded-t-lg ">
            {/* User Profile Pic flexbox */}

            <div className="profile mr-5">
              <Image
                width={100}
                height={100}
                src="/profile_icon.svg"
                alt="profile"
              />
            </div>
            {/* User Details flexbox */}
            <div className="mt-3">
              <p className="font-nunito font-bold text-base text-left">
                {userInfo.firstName + " " + userInfo.middleName + " " + userInfo.lastName}
              </p>
              <span className="font-nunito font-bold text-base text-left">
                User ID:
              </span>
              <span className="ml-3 font-nunito text-base text-left">
                {customerInfo.userID}
              </span>
              <p className=" mt-5 mb-[-20px] font-nunito font-bold bg-white w-fit p-2">
                {" "}
                Customer Info{" "}
              </p>
            </div>
            <div className="ml-32 mt-[69px] font-dosis text-sm">
              <a className="text-green-500 block text-right font-semibold hover:underline hover:text-green-400 hover:cursor-pointer">
                View Valid ID
              </a>
              <a className="text-green-500 text-right block font-semibold hover:underline hover:text-green-400 hover:cursor-pointer">
                View Customer Info Sheet
              </a>
            </div>
          </div>
          {/* Header Row End */}
          <div className="p-5 flex-row border-2 border-t-0 rounded-b-lg bg-white">
            {/* Primary Customer Details */}
            <div className="flex flex-row">
              {/* Name*/}
              <div className="font-nunito font-bold text-right">
                <p>First Name:</p>
                <p>Last Name:</p>
                <p>Middle Name:</p>
              </div>

              <div className="mx-5 text-left">
                <p>{userInfo.firstName}</p>
                <p>{userInfo.middleName}</p>
                <p>{userInfo.lastName}</p>
              </div>
              {/* Name*/}
              <div className="font-nunito font-bold text-right">
                <p>Sex:</p>
                <p>Status:</p>
              </div>

              <div className="mx-5 text-left">
                <p>{customerInfo.sex}</p>
                <p>{customerInfo.status}</p>
              </div>
              {/* BMI */}
              <div className="font-nunito font-bold text-right">
                <p>Height:</p>
                <p>Weight:</p>
              </div>

              <div className="mx-5 text-left">
                <p>{customerInfo.height} cm</p>
                <p>{customerInfo.weight} kg</p>
              </div>
            </div>

            <hr className="h-px my-5 bg-gray-300 border-0" />
            {/* Customer Date/Location Details */}
            <div className="flex flex-row">
              {/* Name*/}
              <div className="font-nunito font-bold text-right">
                <p>Date of Birth:</p>
                <p>Place of Birth:</p>
                <p>Present Address:</p>
                <p>Permanent Address:</p>
              </div>

              <div className="mx-5 text-left">
                <p>{customerInfo.birthDate}</p>
                <p>{customerInfo.birthPlace}</p>
                <p>{customerInfo.presentAddress}</p>
                <p>{customerInfo.permanentAddress}</p>
              </div>
            </div>

            <hr className="h-px my-5 bg-gray-300 border-0" />

            {/* Other Details */}
            <div className="flex flex-row">
              <div className="font-nunito font-bold text-right">
                <p>Contact Number:</p>
                <p>Email Address:</p>
                <p>Complexion:</p>
                <p>Identifying Mark:</p>
              </div>

              <div className="mx-5 text-left">
                <p>{customerInfo.contactNumber}</p>
                <p>{customerInfo.email}</p>
                <p>{customerInfo.complexion}</p>
                <p>{customerInfo.identifyingMark}</p>
              </div>
              {/* Work */}
              <div className="font-nunito font-bold text-right">
                <p>Name of Employer:</p>
                <p>Position:</p>
                <p>Nature of Work:</p>
              </div>

              <div className="mx-5 text-left">
                <p>{customerInfo.employerName}</p>
                <p>{customerInfo.jobPosition}</p>
                <p>{customerInfo.workNature}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CustomerDetails;
