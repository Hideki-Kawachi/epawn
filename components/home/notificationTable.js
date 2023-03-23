import { useRouter } from "next/router";
import React from "react";
import {
	useFilters,
	useGlobalFilter,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";

function NotificationTable({ role, data }) {
	const columns = React.useMemo(
		() => [
			{
				Header: "Transaction",
				accessor: "transactionType",
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

	const router = useRouter();

	function openRow(rowData) {
		console.log("rowData", rowData, "==", role);
		// if manager
		if (role == "manager") {
			//if pawn
			console.log("row trans:", rowData.transactionType);
			if (rowData.transactionType == "Pawn") {
				if (rowData.status == "For Appraisal") {
					router.push({
						pathname: "pawn/manager/appraisal/[transactionID]",
						query: { transactionID: rowData._id },
					});
				} else if (rowData.status == "For Negotiation") {
					router.push({
						pathname: "pawn/manager/negotiation/[transactionID]",
						query: { transactionID: rowData._id },
					});
				} else if (rowData.status == "For Approval") {
					router.push({
						pathname: "pawn/manager/approval/[transactionID]",
						query: { transactionID: rowData._id },
					});
				}
			}
			// if renew
			else if (rowData.transactionType == "Renew") {
				if (rowData.status == "Pending") {
					console.log("pending", rowData);
					router.push({
						pathname: "renew/manager/[transactionID]",
						query: { transactionID: rowData._id },
					});
				}
			}

			// console.log("MANAGER", rowData);
		}
		// if clerk
		else if (role == "clerk") {
			//if pawn
			if (rowData.transactionType == "Pawn") {
				if (rowData.status == "Appraised") {
					router.push({
						pathname: "pawn/clerk/ongoingTransaction/[transactionID]",
						query: { transactionID: rowData._id },
					});
				} else if (rowData.status == "Rejected") {
					router.push({
						pathname: "pawn/clerk/rejected/[transactionID]",
						query: { transactionID: rowData._id },
					});
				} else if (rowData.status == "Approved") {
					router.push({
						pathname: "pawn/clerk/approved/[transactionID]",
						query: { transactionID: rowData._id },
					});
				}
			}
			//if renew
			else if (rowData.transactionType == "Renew") {
				if (rowData.status == "Approved") {
					fetch("api/pawn/updateTransactionStatus", {
						method: "POST",
						body: JSON.stringify({
							transactionID: rowData._id,
							status: "Done",
						}),
					});
				}
			}
			// console.log("CLERK", rowData);
		}
	}

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
					onChange={(e) => setFilter("transactionType", e.target.value)}
					defaultValue={""}
				>
					<option value={""}>All</option>
					<option value={"Pawn"}>Pawn</option>
					<option value={"Renew"}>Renew</option>
					<option value={"Redeem"}>Redeem</option>
				</select>
				<span className="ml-5">Status: </span>
				<select
					className="h-fit"
					onChange={(e) => setFilter("status", e.target.value)}
					defaultValue={""}
				>
					<option value={""}>All</option>
					<option value={"For Appraisal"}>For Appraisal</option>
					<option value={"For Negoation"}>For Negotiation</option>
					<option value={"For Approval"}>For Approval</option>
					<option value={"Appraised"}>Appraised</option>
					<option value={"Pending"}>Pending</option>
					<option value={"Approved"}>Approved</option>
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
								onClick={() => openRow(data[row.id])}
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
