import dayjs from "dayjs";
import React from "react";

function CashflowSummary() {
	return (
		<div className="flex flex-col items-center justify-center p-5 bg-white border-2 border-gray-500 rounded font-nunito">
			<h1 className="text-lg font-semibold">
				Cashflow Summary{" "}
				<span className="text-sm font-normal">
					for {dayjs(new Date()).format("MMM DD, YYYY")}
				</span>
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
					<span>Php 142.00</span>
					<span>Php {}</span>
					<span>Php 14232.00</span>
					<span>Php {}</span>
					<span>Php {}</span>
					<span>Php {}</span>
					<span>Php {}</span>
				</div>
			</div>
		</div>
	);
}

export default CashflowSummary;
