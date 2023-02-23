import React from "react";
import {
	useFilters,
	useGlobalFilter,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";

function NotificationTable({ data }) {
	const columns = React.useMemo(
		() => [
			{
				Header: "Transaction",
				accessor: "transaction",
				disableGlobalFilter: true,
			},
			{ Header: "Customer Name", accessor: "customerName" },
			{ Header: "PT Number", accessor: "ptNumber" },
			{ Header: "Date", accessor: "date", disableGlobalFilter: true },
			{ Header: "Time", accessor: "time", disableGlobalFilter: true },
			{ Header: "Status", accessor: "status", disableGlobalFilter: true },
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
		<>
			<div className="flex items-center justify-center w-3/4 gap-2 my-5 text-base font-nunito">
				<span className="text-base">Search: </span>
				<input
					className="flex-grow"
					onChange={(e) => {
						setGlobalFilter(e.target.value);
					}}
					placeholder={"PT Number or Customer Name"}
				/>
				<span className="ml-5">Transaction: </span>
				<select
					className="h-fit"
					onChange={(e) => setFilter("transaction", e.target.value)}
				>
					<option value={""} selected>
						All
					</option>
					<option value={"Pawn"}>Pawn</option>
					<option value={"Renew"}>Renew</option>
					<option value={"Redeem"}>Redeem</option>
				</select>
				<span className="ml-5">Status: </span>
				<select
					className="h-fit"
					onChange={(e) => setFilter("status", e.target.value)}
				>
					<option value={""} selected>
						All
					</option>
					<option value={"Pawn"}>Pawn</option>
					<option value={"Renew"}>Renew</option>
					<option value={"Redeem"}>Redeem</option>
				</select>
			</div>
			<table {...getTableProps()} className="w-3/4 text-base">
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => {
								if (
									column.Header !== "Transaction" &&
									column.Header.toString() !== "Status"
								) {
									console.log("NOT HEADER", column.Header);
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
													: ""}
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
								onClick={() => console.log("CLICK ROW")}
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
		</>
	);
}

export default NotificationTable;
