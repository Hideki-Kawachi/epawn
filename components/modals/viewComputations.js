import Close from "../closebutton";

function ViewComputation({ trigger, setTrigger }) {
  function closeModal() {
    setTrigger(!trigger);
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
              <p>Other Charges:</p>
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
              <p> Php 3,203.50 </p>
              <p> 3,203.50 </p>
            </div>
            <div className="text-right min-w-fit">
              <p className="font-bold mr-3">Php 95,000.00</p>
              <br />
              <br />
              <p className="mr-3">6,528.50</p>
              <p className="mr-3">0.00</p>
              <p className="mr-3">0.00</p>
              <p className="mr-3">0.00</p>
              <p className="mr-0.5">(3,471.50)</p>
              <p className="mr-3">95,000.00</p>
              <hr className="my-3" />
              <p className="font-bold mr-3">Php 95,000.00</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ViewComputation;
