import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
	useFilters,
	useGlobalFilter,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";
import Modal from "react-modal";
import CustomerDetails from "../modals/customerDetails";

function CustomerSearch({
	userData,
	transactionData,
	pawnTicketData,
	itemData,
}) {
	const [data, setData] = useState([{}]);

	const columns = React.useMemo(
		() => [
			{
				Header: "Customer ID",
				accessor: "userID",
			},
			{ Header: "Customer Name", accessor: "customerName" },
			{
				Header: "Current Amount of Loan",
				accessor: "totalLoanAmount",
				disableGlobalFilter: true,
			},
			{
				Header: "Ongoing PawnTickets",
				accessor: "ongoingPawnTicket",
				disableGlobalFilter: true,
			},
			{
				Header: "Current Pawned Items",
				accessor: "totalPawnedItems",
				disableGlobalFilter: true,
			},
		],
		[]
	);

	useEffect(() => {
		let tempData = [];
		console.log("user:", userData);
		console.log("pt:", pawnTicketData);
		console.log("trans:", transactionData);
		console.log("item:", itemData);

		for (const user of userData) {
			if (user.role == "customer") {
				let customerName =
					user.firstName +
					" " +
					(user.middleName.length > 0
						? user.middleName.charAt(0) + ". "
						: " ") +
					user.lastName;
				let ongoingPawnTicket = 0;
				let totalPawnedItems = 0;
				let totalLoanAmount = 0;
				let itemListIDs = [];

				pawnTicketData.forEach((pt) => {
					if (pt.customerID == user.userID && !pt.isInactive) {
						totalLoanAmount += pt.loanAmount;

						if (!itemListIDs.includes(pt.itemListID) && pt.itemListID) {
							itemListIDs.push(pt.itemListID);
						}
					}
				});

				itemListIDs.forEach((itemListID) => {
					let currentItemList = itemData.filter((item) => {
						return (
							item.itemListID == itemListID &&
							!item.isRedeemed &&
							!item.forAuction
						);
					});
					totalPawnedItems += currentItemList.length;
				});

				if (customerName) {
					tempData.push({
						userID: user.userID,
						customerName: customerName,
						totalLoanAmount: totalLoanAmount
							? totalLoanAmount.toFixed(2)
							: "0.00",
						ongoingPawnTicket: itemListIDs.length,
						totalPawnedItems: totalPawnedItems,
					});
				}
			}
		}
		setData(tempData);
	}, [userData, transactionData, pawnTicketData, itemData]);

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
		console.log("row:", rowData);
		router.push({
			pathname: "search/customer/[customerID]",
			query: { customerID: rowData.userID },
		});
	}

	return (
		<>
			<div className="flex items-center self-start w-2/3 gap-2 my-5 text-sm font-nunito">
				<span className="text-base">Search: </span>
				<input
					className="flex-grow"
					onChange={(e) => {
						setGlobalFilter(e.target.value);
					}}
					placeholder={"Customer ID or Name"}
				/>
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

export default CustomerSearch;
