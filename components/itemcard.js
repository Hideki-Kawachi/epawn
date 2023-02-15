import React from "react";

function ItemCard() {
  return (
    <div className="bg-light shadow-md flex font-nunito rounded-lg h-fit m-5">
      <div className="m-5 w-96">
        <p>
          <b>Name: </b>
          Platinum Ring w/ Certificate
        </p>
        <p>
          <b>Type: </b>
          Ring
        </p>
      </div>
      <div className="mt-5 mr-5">
        <button className="bg-green-300 text-white">View Details</button>
      </div>
    </div>
  );
}

export default ItemCard;
