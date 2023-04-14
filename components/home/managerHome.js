import { data } from "autoprefixer";
import React from "react";
import NotificationTable from "./notificationTable";

function ManagerHome({ notifData, cashflowSummary }) {

	function convertFloat(number) {
      return (
        Number(number).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }

	return (
    <div id="main-content-area">
      <div className="flex flex-row justify-center w-full gap-10 pt-10">
        <NotificationTable
          role={"manager"}
          data={notifData}
        ></NotificationTable>
        <div className="flex flex-col gap-5 p-10 bg-white border-2 rounded whitespace-nowrap">
          <h1 className="text-lg font-bold font-nunito">Today's Cashflow</h1>
          <div className="flex flex-col w-full p-5 text-base font-semibold border-2 border-gray-500 bg-green-50 font-nunito rounded-xl h-fit">
            <span>Current Cash Balance</span>
            {cashflowSummary.balance < 0  ? (
              <span className="font-bold text-end">
                Php{" "}
                <span className="text-xl text-red-500">
                  {convertFloat(cashflowSummary.balance)}
                </span>
              </span>
            ) : (
              <span className="font-bold text-end">
                Php{" "}
                <span className="text-xl">
                  {convertFloat(cashflowSummary.balance)}
                </span>
              </span>
            )}
          </div>
          <div className="flex flex-col w-full p-5 text-base font-semibold border-2 border-gray-500 bg-green-50 font-nunito rounded-xl h-fit">
            <span>Current Cash In</span>
            <span className="font-bold text-end">
              Php{" "}
              <span className="text-xl">
                {convertFloat(cashflowSummary.cashIn)}
              </span>
            </span>
          </div>
          <div className="flex flex-col w-full p-5 text-base font-semibold border-2 border-gray-500 bg-green-50 font-nunito rounded-xl h-fit">
            <span>Current Cash Out</span>
            <span className="font-bold text-end">
              Php{" "}
              <span className="text-xl">
                {convertFloat(cashflowSummary.cashOut)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerHome;
