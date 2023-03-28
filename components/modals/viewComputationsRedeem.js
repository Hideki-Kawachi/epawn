import Close from "../closebutton";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";

function ViewComputation({ trigger, setTrigger, pawnTicket, amountToPay, partialPayment}) {
  	const [loanAmount, setLoanAmount] = useState(
      pawnTicket.loanAmount ? pawnTicket.loanAmount : 0
    );
  	const [advInterest, setAdvInterest] = useState(
      pawnTicket.loanAmount ? pawnTicket.loanAmount * 0.035 : 0
    );
    	const [interest, setInterest] = useState(
        pawnTicket.loanAmount
          ? pawnTicket.loanAmount *
              0.035 *
              monthDiff(new Date(pawnTicket.maturityDate), new Date())
          : 0
      );
    	const [penalties, setPenalties] = useState(
        Number(
          pawnTicket.loanAmount *
            0.01 *
            monthDiff(new Date(pawnTicket.expiryDate), new Date())
        )
      );

  function closeModal() {
    setTrigger(!trigger);
  }

  	const [minPayment, setMinPayment] = useState(
      interest * 2 + penalties + advInterest
    );
    const [newLoanAmount, setNewLoanAmount] = useState(0);
    const [PT, setPT] = useState();

    function monthDiff(dateFrom, dateTo) {
      let diff =
        dateTo.getMonth() -
        dateFrom.getMonth() +
        12 * (dateTo.getFullYear() - dateFrom.getFullYear());
      console.log("diff is:", diff);
      if (diff > 0) {
        return diff;
      } else {
        return 0;
      }
    }

useEffect(() => {
  if (amountToPay) {
    let newLoanAmount = pawnTicket.loanAmount - amountToPay;
    let tempAdvInterest = 0;
    if (newLoanAmount > pawnTicket.loanAmount) {
      setNewLoanAmount(pawnTicket.loanAmount);
      setAdvInterest(pawnTicket.loanAmount * 0.035);
    } else {
      tempAdvInterest = newLoanAmount * 0.035;
      setAdvInterest(tempAdvInterest);
      setNewLoanAmount(newLoanAmount);
    }

  } else {
    setAdvInterest(0);
    setNewLoanAmount(0);
  }
}, [amountToPay]);

useEffect(() => {
  setLoanAmount(pawnTicket.loanAmount ? pawnTicket.loanAmount : 0);
  setPenalties(
    pawnTicket.loanAmount *
      0.01 *
      monthDiff(new Date(pawnTicket.expiryDate), new Date())
  );
  setInterest(
    pawnTicket.loanAmount *
      0.035 *
      monthDiff(new Date(pawnTicket.maturityDate), new Date())
  );
}, [pawnTicket]);


   function convertFloat(number) {
       return Number(number).toLocaleString("en-US", {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
       });
   }
       function getTotalRedeem() {
         var total = 0;

         return total;
       }

  return (
    <>
      <div id="modal-content-area">
        <div className="bg-gray-100 border-2 rounded-xl px-10 pb-10 pt-5 min-w-fit font-nunito">
          <div className="ml-[575px] mb-5" onClick={closeModal}>
            <Close />
          </div>

          <p className="font-nunito text-base text-center mb-5">
            <b> COMPUTATIONS </b>
          </p>
          <div className="flex min-w-fit pr-10 text-sm">
            <div className="text-right">
              <p>Loan Amount:</p>
              <p>Interest (3.5%):</p>
              <p>Adv. Interest:</p>
              <p>Total Interest:</p>
              <p>Penalties (1%):</p>
              {/* <p>Total Items for Redemption:</p> */}
              {/* <p>Total Items for Redemption</p> */}
              <p>Partial Payments:</p>
              <p>Total Amount to be Paid:</p>
              <br />
              <p>
                <i>New</i> Loan Amount:
              </p>
            </div>
            <div className="text-right ml-10 pr-10 min-w-fit">
              <br />
              <p> Php {convertFloat(interest.toFixed(2))} </p>
              <p> {convertFloat(advInterest.toFixed(2))} </p>
            </div>
            <div className="text-right min-w-fit">
              <p className="font-bold mr-3">
                Php {convertFloat(loanAmount.toFixed(2))}
              </p>
              <br />
              <br />
              <p className="mr-3">
                {" "}
                {convertFloat((interest + advInterest).toFixed(2))}
              </p>
              <p className="mr-3">{convertFloat(penalties.toFixed(2))}</p>
              <p className="mr-3">
                {/* {convertFloat(getTotalRedeem())} */}
              </p>
              <p className="mr-1.5">
                ({convertFloat(partialPayment.toFixed(2))})
              </p>
              <p className="mr-3">{convertFloat(amountToPay)}</p>
              <hr className="my-3" />
              <p className="font-bold mr-3">
                Php {convertFloat(newLoanAmount.toFixed(2))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ViewComputation;
