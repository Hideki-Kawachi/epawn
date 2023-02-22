import React, { useState } from "react";
import {
	useAsyncDebounce,
	useFilters,
	useGlobalFilter,
	usePagination,
	useTable,
} from "react-table";
import GlobalFilter from "../../../components/globalFilter";

function ReturnTable({ columns, data }) {
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
		preGlobalFilteredRows,
		setGlobalFilter,
		state: { pageIndex },
	} = useTable(
		{
			columns,
			data,
		},
		useFilters,
		useGlobalFilter,
		usePagination
	);

	function clickUser(userID) {
		console.log("user id from table is:", userID);
	}

	return (
		<>
			<GlobalFilter setGlobalFilter={setGlobalFilter}></GlobalFilter>
			<table {...getTableProps()} className="w-3/4 text-base">
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th
									{...column.getHeaderProps()}
									className="border-4 border-gray-500 border-solid"
								>
									{column.render("Header")}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{page.map((row, i) => {
						prepareRow(row);
						return (
							<tr
								{...row.getRowProps()}
								onClick={() => clickUser(row.cells[0].value)}
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

export default ReturnTable;
