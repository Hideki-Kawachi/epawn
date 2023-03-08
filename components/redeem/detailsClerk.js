import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import AuthorizedRep from "../modals/authorizedRep";
import CustomerDetails from "../modals/customerDetails"; 
import PawnHistory from "../modals/pawnHistory";
import dayjs from "dayjs";

function DetailsCardClerk({redeem, customerName, contactNumber, address, loanDate, maturityDate, expiryDate, branch, search}) {
  const [isOriginal, setOriginal] = useState("original");
  const [repModal, setRepModal] = useState(false); 
  const [customerModal, setCustomerModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [otherCharges, setOtherCharges] = useState(0);
  const [loanAmount, setLoan] = useState(10000)
  const [newloanAmount, setNewLoanAmount] = useState(1000)


  function repOpen(){
    setRepModal(true);
  }

  function customerOpen() {
      setCustomerModal(true);
  }

  function historyOpen() {
    setHistoryModal(true);
  }
  
  function searchPT(pawnticketID){
    search(pawnticketID)
  }

    
  function getInterest(loan){
    //plan: multiply loan * 0.035 with month diff
    if(loanDate == "N/A" || maturityDate == "N/A")
      return "N/A"
    else{
      const date1 = dayjs(loanDate, "MM/DD/YYYY");
      const date2 = dayjs(maturityDate, "MM/DD/YYYY");

      const diffInMonths = date2.diff(date1, "month");

      console.log(
        diffInMonths +
          " months and " +
          convertFloat(loan * 0.035 * diffInMonths)
      );
      return convertFloat(loan * 0.035 * diffInMonths);
    }
  }

  function getAdvInterest(newLoan){
  if (loanDate == "N/A" || maturityDate == "N/A") 
    return "N/A"
  else
    return convertFloat(newLoan * 0.035)
  }

  function getTotalInterest(int, advint){
      if (loanDate == "N/A" || maturityDate == "N/A") 
        return "N/A";
      else 
        return convertFloat(Number(int) + Number(advint));
  }

  function convertFloat(number) {
    return Number(number).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function convertDate(date){
    if(date == "N/A")
      return "N/A"
    else {
      const dt = new Date(date);
      console.log(dt);
      return dayjs(dt).format("MM/DD/YYYY");
    };
  }

  function getPartialPayment(loan, amount){
    return convertFloat()
  }
  
  function getTotalRedeem(redeemList){
    var total = 0;

    redeemList.forEach((item) => {
       total += Number(item.itemPrice)
       //console.log("total is " + total + " while itemPrice is " + item.itemPrice)
    });

    return convertFloat(total)
  }

  return (
    <>
      <div
        id="detailscard"
        className="drop-shadow-lg flex text-base font-nunito pr-10"
      >
        <Modal isOpen={repModal} ariaHideApp={false} className="modal">
          <AuthorizedRep trigger={repModal} setTrigger={setRepModal} />
        </Modal>

        <Modal isOpen={historyModal} ariaHideApp={false} className="modal">
          <PawnHistory trigger={historyModal} setTrigger={setHistoryModal} />
        </Modal>

        <Modal isOpen={customerModal} ariaHideApp={false} className="modal">
          <CustomerDetails
            trigger={customerModal}
            setTrigger={setCustomerModal}
          />
        </Modal>
        {/* Left Side of the Card (Details) */}
        <div className="m-10 ">
          <span className="font-bold pr-7">PT Number:</span>
          <input
            className="border rounded-md stroke-gray-500 px-3"
            onChange={(e) => searchPT(e.target.value)}
          />
          <p className="text-sm text-gray-300 pl-[163px]">Format: X-XXXX </p>

          <hr className="h-px my-8 bg-gray-500 border-0" />

          {/* Customer Details */}
          <p className="font-bold pr-7">
            Customer Details:
            {/* View Customer Details Button */}
            <span
              className="ml-3 hover:cursor-pointer inline-block"
              onClick={customerOpen}
            >
              <svg
                width="30 "
                height="30"
                viewBox="0 -1 40 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.5007 7.6875C11.959 7.6875 4.6644 13.0004 1.70898 20.5C4.6644 27.9996 11.959 33.3125 20.5007 33.3125C29.0423 33.3125 36.3369 27.9996 39.2923 20.5C36.3369 13.0004 29.0423 7.6875 20.5007 7.6875ZM20.5007 29.0417C15.7857 29.0417 11.959 25.215 11.959 20.5C11.959 15.785 15.7857 11.9583 20.5007 11.9583C25.2157 11.9583 29.0423 15.785 29.0423 20.5C29.0423 25.215 25.2157 29.0417 20.5007 29.0417ZM20.5007 15.375C17.6648 15.375 15.3757 17.6642 15.3757 20.5C15.3757 23.3358 17.6648 25.625 20.5007 25.625C23.3365 25.625 25.6257 23.3358 25.6257 20.5C25.6257 17.6642 23.3365 15.375 20.5007 15.375Z"
                  fill="black"
                  className="hover:fill-gray-300"
                />
              </svg>
            </span>
          </p>
          <div className="flex">
            <div className="text-right ml-5 min-w-fit">
              <p className="">Full Name:</p>
              <p className="">Contact Number:</p>
              <p className="">Address:</p>
            </div>
            <div className="text-left ml-5">
              <p className="">{customerName}</p>
              <p className="">{contactNumber}</p>
              <p className="max-w-md">
                {/* Used to make long address break line */}
                {address}
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="text-right ml-10 min-w-fit">
              <p className="font-bold">Redeemed by: </p>
            </div>
            <div className="text-right ml-5 min-w-fit">
              <select
                className="px-5"
                onChange={(e) => setOriginal(e.target.value)}
              >
                <option key="00" value="original">
                  {" "}
                  Original Customer{" "}
                </option>
                <option key="01" value="authorized">
                  {" "}
                  Authorized Rep.{" "}
                </option>
              </select>
              {isOriginal == "authorized" ? (
                <button
                  className="bg-green-300 ml-2 text-sm text-white px-5"
                  onClick={repOpen}
                >
                  {" "}
                  Add Details{" "}
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>

          <hr className="h-px my-8 bg-gray-500 border-0" />

          {/* Pawn Details */}
          <p className="font-bold pr-7">
            Pawn Details:
            <span
              className="ml-3 hover:cursor-pointer inline-block px-2"
              onClick={historyOpen}
            >
              <svg
                width="30 "
                height="30"
                viewBox="10 0 30 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27.5618 16.3333H24.4993V26.5417L33.2377 31.7275L34.7077 29.2571L27.5618 25.0104V16.3333ZM26.541 6.125C21.6677 6.125 16.9939 8.06093 13.5479 11.5069C10.1019 14.9529 8.16602 19.6266 8.16602 24.5H2.04102L10.126 32.7279L18.3743 24.5H12.2493C12.2493 20.7096 13.7551 17.0745 16.4353 14.3943C19.1155 11.7141 22.7506 10.2083 26.541 10.2083C30.3314 10.2083 33.9665 11.7141 36.6468 14.3943C39.327 17.0745 40.8327 20.7096 40.8327 24.5C40.8327 28.2904 39.327 31.9255 36.6468 34.6057C33.9665 37.2859 30.3314 38.7917 26.541 38.7917C22.6006 38.7917 19.0277 37.1788 16.4552 34.5858L13.556 37.485C15.2536 39.2013 17.2763 40.5619 19.5058 41.4874C21.7354 42.4128 24.127 42.8846 26.541 42.875C31.4144 42.875 36.0881 40.9391 39.5341 37.4931C42.9801 34.0471 44.916 29.3734 44.916 24.5C44.916 19.6266 42.9801 14.9529 39.5341 11.5069C36.0881 8.06093 31.4144 6.125 26.541 6.125Z"
                  fill="black"
                  className="hover:fill-gray-300"
                />
              </svg>
            </span>
          </p>
          <div className="flex">
            <div className="text-right ml-5">
              <p className="">Date Loan Granted:</p>
              <p className="">Maturity Date:</p>
              <p className="">Expiry Date:</p>
              <p className="">Branch:</p>
            </div>
            <div className="text-left ml-5">
              <p className="">{convertDate(loanDate)}</p>
              <p className="">{convertDate(maturityDate)}</p>
              <p className="">{convertDate(expiryDate)}</p>
              <p className="">{branch}</p>
            </div>
          </div>
        </div>
        {/* Right Side Side of the Card (Computations) */}
        <div className="min-w-fit">
          <div className="mt-20 p-10 bg-gray-100 border-2  rounded-xl ">
            <p className="font-bold pr-7">Computations</p>
            <div className="flex min-w-fit pr-10">
              <div className="text-right">
                <p>Loan Amount:</p>
                <p>Interest (3.5%):</p>
                <p>Adv. Interest:</p>
                <p>Total Interest:</p>
                <p>Penalties (1%):</p>
                {/* <p>Other Charges:</p> */}
                <p>Total Items for Redemption:</p>
                <p>Partial Payments:</p>
                <p>Amount Paid:</p>
                <br />
                <p>
                  <i>New</i> Loan Amount:
                </p>
              </div>
              <div className="text-right ml-10 pr-10 min-w-fit">
                <br />
                <p> Php {getInterest(loanAmount)} </p>
                <p> {getAdvInterest(newloanAmount)} </p>
              </div>
              <div className="text-right min-w-fit">
                <p className="font-bold mr-3">Php {convertFloat(loanAmount)}</p>
                <br />
                <br />
                <p className="mr-3">
                  {getTotalInterest(getInterest(loanAmount), getAdvInterest(newloanAmount))}
                </p>
                <p className="mr-3">0.00</p>
                {/* <p>
                  <input
                    type="number"
                    className="text-right border rounded-md stroke-gray-500 px-3 w-40 mb-1"
                  />
                </p> */}
                <p className="mr-3">{getTotalRedeem(redeem)}</p>
                <p className="mr-0.5">(3,471.50)</p>
                <p className="mr-3">95,000.00</p>
                <hr className="my-3" />
                <p className="font-bold mr-3">
                  Php {convertFloat(newloanAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailsCardClerk;
