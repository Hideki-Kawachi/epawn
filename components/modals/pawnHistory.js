import React, { useMemo } from "react";
import Close from "../closebutton";
import pawnhistoryMock from "../tempData/pawnhistory_MOCK.json";
import {
	useTable,
	useSortBy,
	useGlobalFilter,
	usePagination,
} from "react-table";
import { isObjectIdOrHexString } from "mongoose";

function PawnHistory({ trigger, setTrigger, pawnHistory, pawnTicketID }) {
	const data = React.useMemo(() => pawnHistory, []);
	const columns = React.useMemo(
		() => [
			{ Header: "PT Number", accessor: "pawnTicketID" },
			{
				Header: "Transaction",
				accessor: "transactionType",
				disableGlobalFilter: true,
			},
			{ Header: "Branch", accessor: "branchID", disableGlobalFilter: true },
			{ Header: "Date", accessor: "loanDate", disableGlobalFilter: true },
			{
				Header: "Amount Paid",
				accessor: "amountPaid",
				disableGlobalFilter: true,
			},
			{
				Header: "Loan Amount",
				accessor: "loanAmount",
				disableGlobalFilter: true,
			},
		],
		[]
	);
	function closeModal() {
		setTrigger(!trigger);
	}
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		nextPage,
		canNextPage,
		previousPage,
		canPreviousPage,
		gotoPage,
		pageOptions,
		pageCount,
		prepareRow,
	} = useTable(
		{
			columns,
			data,
		},

		useGlobalFilter,
		useSortBy,
		usePagination
	);

	const isDataEmpty = pawnHistory.length === 0

	return (
		<>
			<div id="modal-content-area">
				<div className="px-10 pt-5 pb-10 bg-gray-100 border-2 rounded-xl min-w-fit">
					<div className="ml-[950px] mt-5 mb-5" onClick={closeModal}>
						<Close />
					</div>
					<div>
						<p className="mb-5 text-lg font-bold text-center font-dosis">
							Pawn History of <span className = "font-nunito"> {pawnTicketID} </span>
						</p>
					</div>
					<div>
						{ !isDataEmpty ? ( 
						<table
							className="table-auto text-sm font-nunito text-center w-[950px] h-80 divide-y divide-gray-200 border border-separate rounded-t-xl bg-green-300"
							{...getTableProps()}
						>
							<thead className="">
								{headerGroups.map((headerGroup) => (
									<tr
										id="btable"
										className=""
										key={0}
										{...headerGroup.getHeaderGroupProps()}
									>
										{headerGroup.headers.map((column) => (
											<th
												className=""
												key={0}
												{...column.getHeaderProps(
													column.getSortByToggleProps()
												)}
											>
												{column.render("Header")}
												<span>
													{column.isSorted
														? column.isSortedDesc
															? "▼"
															: "▲"
														: " "}
												</span>
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody {...getTableBodyProps()}>
								{page.map((row) => {
									prepareRow(row);
									return (
										<tr id="btable" key={0} {...row.getRowProps()}>
											{row.cells.map((cell) => {
												return (
													<td
														className="bg-white border border-white"
														key={0}
														{...cell.getCellProps()}
													>
														{cell.render("Cell")}
													</td>
												);
											})}
										</tr>
									);
								})}
							</tbody>
						</table>
						) : (
						<div>
							<div className = "font-nunito text-gray-400 text-lg text-center font-bold pt-20 pb-32">
									
									No past transactions
							</div>
						</div>		
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default PawnHistory;
