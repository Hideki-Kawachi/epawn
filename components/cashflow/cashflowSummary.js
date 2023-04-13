import dayjs from "dayjs";
import React from "react";

function CashflowSummary({ cashflowSummary }) {
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
							? cashflowSummary.beginningBalance.toFixed(2)
							: "0.00"}
					</span>
					<span className="text-red-500">
						(Php {cashflowSummary.pawn.toFixed(2)})
					</span>
					<span className="text-green-300">
						Php {cashflowSummary.redeem.toFixed(2)}
					</span>
					<span className="text-green-300">
						Php {cashflowSummary.renew.toFixed(2)}
					</span>
					<span className="text-green-300">
						Php {cashflowSummary.additionalFunds.toFixed(2)}
					</span>
					<span className="text-red-500">
						(Php {cashflowSummary.withdraw.toFixed(2)})
					</span>
					<span className="font-semibold">
						Php {cashflowSummary.currentBalance.toFixed(2)}
					</span>
				</div>
			</div>
		</div>
	);
}

export default CashflowSummary;
