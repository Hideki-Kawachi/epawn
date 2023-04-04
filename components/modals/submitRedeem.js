import React from "react";
import Close from "../closebutton";
import ItemCard from "../itemcard";
import { useRouter } from "next/router";
export const Submit = ({trigger, setTrigger, mode, PTnumber, itemList, changeMode, setSendForm, sendForm, submitForm}) => {
    const router = useRouter();
    function closeModal(){
        setTrigger(!trigger);
    }

    function modeChange(){
      changeMode(!mode);
      setTrigger(!trigger);
    }

    function goForm(){
      setSendForm(true);
    }
  function convertFloat(number) {
    if (mode) return "0.00";
    else {
      return Number(number).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }

  function getTotalRedeem(itemList){
    var total = 0;

    itemList.forEach((item) => {
       total += Number(item.price)
    });
    return convertFloat(total)
  }
  return (
    <>
      <div id="modal-content-area">
        <div className="bg-gray-100 border-2 rounded-xl px-20 pb-10 pt-10 min-w-fit">
          <div className="ml-[615px] mb-5" onClick={closeModal}>
            <Close />
          </div>
        {mode == true ? (
          <p className="font-nunito text-base text-center mb-5">
            Select  <b>Pawn Ticket {PTnumber}</b> <br/> with the following items? 
          </p>
          ): ( 
            <p className="font-nunito text-base text-center mb-5">
            Are you sure you want to continue with the <b> Redemption</b> of{" "}
            <br />
            <b>Pawn Ticket {PTnumber}</b> of items:{" "}
          </p>
          )}
          
            <div className="p-5 mx-10 w-[720px] h-96  overflow-y-scroll bg-white border-2">
              {itemList.map((items) => (
                <div className="flex flex-row" key={items.itemID}>
                  <ItemCard
                    key={items.itemID}
                    itemDetails={items}
                  ></ItemCard>
                </div>
              ))}
            </div>
          {mode == false ? (
          <p className="text-center text-base">
            For a total of <b>Php {getTotalRedeem(itemList)}</b>
          </p>
          ) :( <> </>)}
          <button
            className="bg-red-300 text-base px-24 mt-5 mx-5"
            onClick={closeModal}
          >
            Cancel
          </button>
          {mode == true ? (
          <button className="bg-green-300 text-base px-24 mt-5 mx-5" onClick={modeChange}>
            Select
          </button>
          ):(
            <button className="bg-green-300 text-base px-24 mt-5 mx-5" onClick={submitForm}>
            Submit
          </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Submit;
