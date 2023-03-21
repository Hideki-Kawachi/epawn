import Close from "../closebutton";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";

function ViewComputation({ trigger, setTrigger, pawnTicket, amountToPay}) {
  const [partial, setPartial] = useState(0);
  
  function closeModal() {
    setTrigger(!trigger);
  }

   function partialPayment(amount, interest) {
     if (amount == NaN || interest == NaN) {
       return 0;
     } else if (Number(amount) - Number(interest) < 0) return 0;
     else if (Number(amount) - Number(interest) > pawnTicket.loanAmount) return 0;
     else {
       //  setPartial(amount - interest);
       return Number(amount) - Number(interest);
     }
   }
   function amountLoan(amount) {
     getNewLoan(amount);
   }

   function payAmount(number) {
     getAmount(number);
   }
   function getInterest(loan) {
     //plan: multiply loan * 0.035 with month diff
     if (pawnTicket.loanDate == null || pawnTicket.maturityDate == null)
       return "N/A";
     else {
       const date1 = dayjs(pawnTicket.loanDate, "MM/DD/YYYY");
       const date2 = dayjs(pawnTicket.maturityDate, "MM/DD/YYYY");
       const diffInMonths = date2.diff(date1, "month");
       //setInterest(loan * 0.035 * diffInMonths);
       return loan * 0.035 * diffInMonths;
     }
   }

   function getAdvInterest(newLoan) {
     if (pawnTicket.loanDate == null || pawnTicket.maturityDate == null)
       return "N/A";
     else {
       //  setAdvInterest(newLoan * 0.035)
       return newLoan * 0.035;
     }
   }

   function getTotalInterest(int, advint) {
     //console.log("test " + (int + advint));
     if (int == NaN || advint == NaN) {
       // setTotalInterest(0);
       return 0;
     } else {
       // setTotalInterest(int + advint);
     }
     return int + advint;
   }

   function getNewLoanAmount(loan, partial) {
     if (loan - partial < 0) return 0;
     else return Number(loan) - Number(partial);
   }

   function convertFloat(number) {
       return Number(number).toLocaleString("en-US", {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
       });
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
              <p>Partial Payments:</p>
              <p>Amount Paid:</p>
              <br />
              <p>
                <i>New</i> Loan Amount:
              </p>
            </div>
            <div className="text-right ml-10 pr-10 min-w-fit">
              <br />
              <p> Php {convertFloat(getInterest(pawnTicket.loanAmount))} </p>
              <p>
                {" "}
                {convertFloat(
                  getAdvInterest(
                    getNewLoanAmount(pawnTicket.loanAmount, partial)
                  )
                )}{" "}
              </p>
            </div>
            <div className="text-right min-w-fit">
              <p className="font-bold mr-3">
                Php {convertFloat(pawnTicket.loanAmount)}
              </p>
              <br />
              <br />
              <p className="mr-3">
                {" "}
                
                {convertFloat(
                  getTotalInterest(
                    getInterest(pawnTicket.loanAmount),
                    getAdvInterest(
                      getNewLoanAmount(pawnTicket.loanAmount, partial)
                    )
                  )
                )}
                
              </p>
              <p className="mr-3">0.00</p>
              <p className="mr-0.5">
                (
                {convertFloat(
                  partialPayment(
                    amountToPay,
                    getTotalInterest(
                      getInterest(pawnTicket.loanAmount),
                      getAdvInterest(
                        getNewLoanAmount(pawnTicket.loanAmount, partial)
                      )
                    )
                  )
                )}
                )
              </p>
              <p className="mr-3">{convertFloat(amountToPay)}</p>
              <hr className="my-3" />
              <p className="font-bold mr-3">
                Php{" "}
                {convertFloat(
                  getNewLoanAmount(
                    pawnTicket.loanAmount,
                    partialPayment(
                      amountToPay,
                      getTotalInterest(
                        getInterest(pawnTicket.loanAmount),
                        getAdvInterest(
                          getNewLoanAmount(pawnTicket.loanAmount, partial)
                        )
                      )
                    )
                  )
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ViewComputation;
