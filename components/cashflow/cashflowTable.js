import { useRouter } from "next/router";
import React from "react";
import {
	useFilters,
	useGlobalFilter,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";

function CashflowTable({ data }) {
	const columns = React.useMemo(
		() => [
			{
				Header: "Transaction",
				accessor: "transactionType",
				disableGlobalFilter: true,
			},
			{ Header: "Cash In", accessor: "cashIn", disableGlobalFilter: true },
			{ Header: "Cash Out", accessor: "cashOut", disableGlobalFilter: true },
			{ Header: "Date", accessor: "date", disableGlobalFilter: true },
			{ Header: "Time", accessor: "time", disableGlobalFilter: true },
		],
		[]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		pageOptions,
		gotoPage,
		canPreviousPage,
		canNextPage,
		pageCount,
		nextPage,
		previousPage,
		setGlobalFilter,
		setFilter,
		state: { pageIndex },
	} = useTable(
		{
			columns,
			data,
		},

		useFilters,
		useGlobalFilter,
		useSortBy,
		usePagination
	);
	return (
		<div className="p-5 bg-white border-2 border-gray-500 rounded">
			<div className="flex w-full gap-2 my-5 text-base font-nunito">
				<span className="ml-5">Transaction: </span>
				<select
					className="h-fit"
					onChange={(e) => setFilter("transactionType", e.target.value)}
					defaultValue={""}
				>
					<option value={""}>All</option>
					<option value={"Pawn"}>Pawn</option>
					<option value={"Renew"}>Renew</option>
					<option value={"Redeem"}>Redeem</option>
					<option value={"Withdraw"}>Withdraw</option>
					<option value={"Add. Funds"}>Add. Funds</option>
				</select>
			</div>
			<table {...getTableProps()} className="w-full text-base">
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => {
								if (
									column.Header !== "Transaction" &&
									column.Header.toString() !== "Status"
								) {
									return (
										<th
											{...column.getHeaderProps(column.getSortByToggleProps())}
											className="border-4 border-gray-500 border-solid"
										>
											{column.render("Header")}
											<span className="ml-2 text-base">
												{column.isSorted
													? column.isSortedDesc
														? "↑"
														: "↓"
													: "-"}
											</span>
										</th>
									);
								}

								return (
									<th
										{...column.getHeaderProps()}
										className="border-4 border-gray-500 border-solid"
									>
										{column.render("Header")}
									</th>
								);
							})}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{page.map((row, i) => {
						prepareRow(row);
						return (
							<tr
								{...row.getRowProps()}
								// onClick={() => openRow(data[row.id])}
								className="cursor-pointer hover:bg-green-100"
							>
								{row.cells.map((cell) => {
									return (
										<td
											{...cell.getCellProps()}
											className="p-1 border-2 border-gray-300"
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
			<div className="pawn-pagination-container">
				<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
					{"<<"}
				</button>{" "}
				<button onClick={() => previousPage()} disabled={!canPreviousPage}>
					{"<"}
				</button>
				<span>
					Page{" "}
					<strong>
						{pageIndex + 1} of {pageOptions.length}
					</strong>
				</span>
				<button onClick={() => nextPage()} disabled={!canNextPage}>
					{">"}
				</button>{" "}
				<button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
					{">>"}
				</button>{" "}
			</div>
		</div>
	);
}

export default CashflowTable;
