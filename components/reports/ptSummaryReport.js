import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
	useFilters,
	useGlobalFilter,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";
import { utils, writeFile, writeFileXLSX, writeXLSX } from "xlsx";
import printReportPTData from "../../utilities/printReportPTData";
import { set } from "mongoose";

function PawnTicketSummaryReport({ data }) {
	const columns = React.useMemo(
		() => [
			{
				Header: "Branch",
				accessor: "branchName",
				Cell: ({ value }) => {
					return <div className="px-10 text-center">{value}</div>;
				},
			},
			{
				Header: "Average Loan Amount",
				accessor: "avgLoan",
				disableGlobalFilter: true,
				Cell: ({ value }) => {
					return <div className="px-10 text-center">{value}</div>;
				},
			},
			{
				Header: "Active Pawn Tickets",
				accessor: "activeCount",
				//filter: "between",
				disableGlobalFilter: true,
				Cell: ({ value }) => {
					return <div className="px-10 text-center">{value}</div>;
				},
			},
			{
				Header: "Renewal Rate",
				accessor: "renewalRate",
				disableGlobalFilter: true,
				Cell: ({ value }) => {
					return <div className="px-10 text-center">{value}</div>;
				},
			},
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

	function convertFloat(number) {
		return (
			"Php " +
			Number(number).toLocaleString("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})
		);
	}

	return (
		<>
			<p className="my-5 text-base font-semibold text-center text-green-500 font-dosis">
				PawnTicket Summary
			</p>

			<div className="flex items-center justify-center mb-5">
				<table
					{...getTableProps()}
					className="w-3/4 text-sm border font-nunito"
				>
					<thead>
						{headerGroups.map((headerGroup) => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => {
									return (
										<th
											{...column.getHeaderProps(column.getSortByToggleProps())}
											className="py-4 pl-3 text-sm text-center font-nunito bg-green-50"
										>
											{column.render("Header")}
											<span className="ml-2 text-base">
												{column.isSorted
													? column.isSortedDesc
														? "▴"
														: "▾"
													: "-"}
											</span>
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
									className={i % 2 === 0 ? "text-sm  " : "text-sm  bg-gray-150"}
								>
									{row.cells.map((cell) => {
										return (
											<td {...cell.getCellProps()} className="py-2 pl-3">
												{cell.render("Cell")}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
}

export default PawnTicketSummaryReport;
