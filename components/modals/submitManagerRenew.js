import React from "react";
import Close from "../closebutton";
import ItemCard from "../itemcard";
import { useRouter } from "next/router";

export const Submit = ({
  trigger,
  setTrigger,
  PTnumber,
  itemList,
  setSendForm,
  amountToPay,
}) => {
  const router = useRouter();
  function closeModal() {
    setTrigger(!trigger);
  }


  function goForm() {
    setSendForm(true);
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
        <div className="px-20 pt-10 pb-10 bg-gray-100 border-2 rounded-xl min-w-fit">
          <div className="ml-[750px] mb-5" onClick={closeModal}>
            <Close />
          </div>
          <p className="mb-5 text-base text-center font-nunito">
            Are you sure you want to approve the <b> Renewal </b> of <br />
            <b>Pawn Ticket {PTnumber}</b> of items:{" "}
          </p>

          <div className="p-5 mx-10 w-[720px] h-96  overflow-y-scroll bg-white border-2">
            {itemList.map((items) => (
              <div className="flex flex-row" key={items.itemID}>
                <ItemCard key={items.itemID} itemDetails={items}></ItemCard>
              </div>
            ))}
          </div>
          <p className="text-base font-nunito text-center mt-4">
            For a total of <b>Php {convertFloat(amountToPay)}</b>
          </p>

          <p className="text-sm font-nunito text-center text-gray-400">
            The new pawn ticket will be automatically printed after clicking <b>Submit</b>.
          </p>
          <div className="ml-[480px] mt-5">
            <button
              className="px-24 mx-3 mt-5 text-base bg-red-300"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="px-24 mx-3 mt-5 text-base bg-green-300"
              onClick={goForm}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Submit;
