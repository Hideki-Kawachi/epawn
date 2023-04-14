import dayjs from "dayjs";
import React from "react";

function CashflowSummary({ cashflowSummary }) {

	function convertFloat(number) {
      return (
        Number(number).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }

	return (
		<div className="flex flex-col items-center justify-center p-5 bg-white border-2 border-gray-500 rounded font-nunito">
			<h1 className="text-lg font-semibold font-dosis">
				Cashflow Summary{" "}

			</h1>

			<div className="flex flex-row justify-center w-full gap-8 mt-2 text-base">
				<div className="flex flex-col gap-1 font-semibold text-end">
					<span>Beginning Balance: </span>
					<span>Pawn: </span>
					<span>Redeem: </span>
					<span>Renew: </span>
					<span>Additional Funds: </span>
					<span>Withdrawals: </span>
					<span>Current Balance: </span>
				</div>
				<div className="flex flex-col gap-1 text-end">
					<span className="text-green-300">
						Php{" "}
						{cashflowSummary.beginningBalance
							? convertFloat(cashflowSummary.beginningBalance)
							: "Php 0.00"}
					</span>
					<span className="text-red-500">
						(Php {convertFloat(cashflowSummary.pawn)})
					</span>
					<span className="text-green-300">
						Php {convertFloat(cashflowSummary.redeem)}
					</span>
					<span className="text-green-300">
						Php {convertFloat(cashflowSummary.renew)}
					</span>
					<span className="text-green-300">
						Php {convertFloat(cashflowSummary.additionalFunds)}
					</span>
					<span className="text-red-500">
						(Php {convertFloat(cashflowSummary.withdraw)})
					</span>
					<span className="font-semibold">
						Php {convertFloat(cashflowSummary.currentBalance)}
					</span>
				</div>
			</div>
		</div>
	);
}

export default CashflowSummary;
