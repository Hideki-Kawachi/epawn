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

function PawnTicketReport({
	pawnTicketData,
	userData,
	itemData,
	branchData,
	transactionData,
}) {
	const [data, setData] = useState([{}]);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());

	useEffect(() => {
		let tempData = [];
		console.log("pt:", pawnTicketData);
		for (const pt of pawnTicketData) {
			let customerName;
			let currTransaction = transactionData.find((transac) => {
				return transac._id == pt.transactionID;
			});

			let currBranch = branchData.find((branch) => {
				return branch.branchID == currTransaction.branchID;
			});

			let status = "Active";

			if (pt.isInactive) {
				status = "Inactive";
			}

			console.log("customer name:", customerName);
			tempData.push({
				pawnTicketID: pt.pawnTicketID,
				branchName: currBranch.branchName,
				status: status,
				loanAmount: pt.loanAmount?.toFixed(2),
				expiryDate: dayjs(new Date(pt.expiryDate)).format("MMM DD, YYYY"),
				maturityDate: dayjs(new Date(pt.maturityDate)).format("MMM DD, YYYY"),
				loanDate: dayjs(new Date(pt.loanDate)).format("MMM DD, YYYY"),
			});
		}
		setData(tempData);
	}, [userData, pawnTicketData, itemData, branchData, transactionData]);

	useEffect(() => {}, [startDate, endDate]);

	const columns = React.useMemo(
		() => [
			{
				Header: "PT Number",
				accessor: "pawnTicketID",
			},
			{ Header: "Branch", accessor: "branchName" },
			{
				Header: "Status",
				accessor: "status",
				disableGlobalFilter: true,
			},
			{
				Header: "Loan Date",
				accessor: "loanDate",
				filter: "between",
				disableGlobalFilter: true,
			},
			{
				Header: "Maturity Date",
				accessor: "maturityDate",
				disableGlobalFilter: true,
			},
			{
				Header: "Expiry Date",
				accessor: "expiryDate",
				disableGlobalFilter: true,
			},
			{
				Header: "Amount of Loan",
				accessor: "loanAmount",
				disableGlobalFilter: true,
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

	const router = useRouter();

	// function openRow(rowData) {
	// 	router.push({
	// 		pathname: "search/pawnTicket/[pawnTicketID]",
	// 		query: { pawnTicketID: rowData.pawnTicketID },
	// 	});
	// }

	return (
		<>
			<div className="flex items-center self-start w-2/3 gap-2 my-5 text-sm font-nunito">
				<span className="ml-5">Starting Date: </span>
				<input
					type="date"
					onChange={(e) => {
						setStartDate(new Date(e.target.value));
					}}
				></input>
				<span className="ml-5">Starting Date: </span>
				<input
					type="date"
					onChange={(e) => {
						setEndDate(new Date(e.target.value));
					}}
				></input>
				<span className="ml-5">Branch: </span>
				<select
					className="h-fit"
					onChange={(e) => setFilter("branchName", e.target.value)}
					defaultValue={""}
				>
					<option value={""}>All</option>
					{branchData.map((branch) => (
						<option key={branch.branchName} value={branch.branchName}>
							{branch.branchName}
						</option>
					))}
				</select>
				<span className="ml-5">Status: </span>
				<select
					className="h-fit"
					onChange={(e) => setFilter("status", e.target.value)}
					defaultValue={""}
				>
					<option value={""}>All</option>
					<option value={"Active"}>Active</option>
					<option value={"Inactive"}>Inactive</option>
				</select>
			</div>
			<table {...getTableProps()} className="w-full text-sm">
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => {
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
		</>
	);
}

export default PawnTicketReport;
