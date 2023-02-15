import React from "react";


function DetailsCard() {
  return (
    <>
      <div
        id="detailscard"
        className="drop-shadow-lg flex text-base font-nunito pr-10"
      >
        {/* Left Side of the Card (Details) */}
        <div className="m-10 ">
          <span className="font-bold pr-7">PT Number:</span>
          <input className="border rounded-md stroke-gray-500 px-3" />
          <p className="text-sm text-gray-300 pl-[163px]">Format: X-XXXX </p>

          <hr className="h-px my-8 bg-gray-500 border-0" />

          {/* Customer Details */}
          <p className="font-bold pr-7">Customer Details:</p>
          <div className="flex">
            <div className="text-right ml-5 min-w-fit">
              <p className="">Full Name:</p>
              <p className="">Contact Number:</p>
              <p className="">Address:</p>
            </div>
            <div className="text-left ml-5">
              <p className="">Joseph L. Dela Cruz</p>
              <p className="">09175301700</p>
              <p className="max-w-md">
                {/* Used to make long address break line */}
                One Archers Residences, Taft Ave, Malate, Metro Manila
              </p>
            </div>
          </div>

          <hr className="h-px my-8 bg-gray-500 border-0" />

          {/* Pawn Details */}
          <p className="font-bold pr-7">Pawn Details:</p>
          <div className="flex">
            <div className="text-right ml-5">
              <p className="">Date Loan Granted:</p>
              <p className="">Maturity Date:</p>
              <p className="">Expiry Date:</p>
              <p className="">Branch:</p>
            </div>
            <div className="text-left ml-5">
              <p className="">12/09/2022</p>
              <p className="">01/09/2022</p>
              <p className="">02/09/2022</p>
              <p className="">Sta. Ana, Manila</p>
            </div>
          </div>
        </div>
        {/* Right Side Side of the Card (Computations) */}
        <div className="min-w-fit">
          <div className="mt-20 p-10 bg-gray-100 border-2 border-gray-500 rounded-xl ">
            <p className="font-bold pr-7">Computations</p>
            <div className="flex min-w-fit pr-10">
              <div className="text-right">
                <p>Loan Amount:</p>
                <p>Interest (3.5%):</p>
                <p>Adv. Interest:</p>
                <p>Total Interest:</p>
                <p>Penalties (1%):</p>
                <p>Other Charges:</p>
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
                <p>
                  <input
                    type="number"
                    className="text-right border rounded-md stroke-gray-500 px-3 w-40 mb-1"
                  />
                </p>
                <p>
                  <input
                    type="number"
                    className="text-right border rounded-md stroke-gray-500 px-3 w-40"
                  />
                </p>
                <hr className="my-3" />
                <p className="font-bold mr-3">Php 95,000.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailsCard;
