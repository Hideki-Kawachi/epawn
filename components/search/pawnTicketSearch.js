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

function PawnTicketSearch({
	pawnTicketData,
	userData,
	itemData,
	branchData,
	transactionData,
}) {
	const [data, setData] = useState([{}]);

	useEffect(() => {
		let tempData = [];
		console.log("pt:", pawnTicketData);
		for (const pt of pawnTicketData) {
			let index = 0;
			let customerName;
			let managerName;
			let clerkName;
			let currTransaction = transactionData.find((transac) => {
				return transac._id == pt.transactionID;
			});

			while (
				(!customerName || !clerkName || !managerName) &&
				index != userData.length
			) {
				let currUser = userData[index];
				console.log("CURR USER:", currUser, "--", index);
				if (currUser.userID == pt.customerID) {
					customerName =
						currUser.firstName +
						" " +
						(currUser.middleName.length > 0
							? currUser.middleName.charAt(0) + ". "
							: " ") +
						currUser.lastName;
				} else if (currUser.userID == currTransaction.clerkID) {
					clerkName =
						currUser.firstName +
						" " +
						(currUser.middleName.length > 0
							? currUser.middleName.charAt(0) + ". "
							: " ") +
						currUser.lastName;
				} else if (currUser.userID == currTransaction.managerID) {
					managerName =
						currUser.firstName +
						" " +
						(currUser.middleName.length > 0
							? currUser.middleName.charAt(0) + ". "
							: " ") +
						currUser.lastName;
				}
				index++;
			}
			console.log("customer name:", customerName);
			tempData.push({
				pawnTicketID: pt.pawnTicketID,
				customerName: customerName,
				loanAmount: pt.loanAmount?.toFixed(2),
				clerkName: clerkName ? clerkName : "--------------",
				managerName: managerName,
				loanDate: dayjs(new Date(pt.loanDate)).format("MMM DD, YYYY"),
			});
		}
		setData(tempData);
	}, [userData, pawnTicketData, itemData, branchData, transactionData]);

	const columns = React.useMemo(
		() => [
			{
				Header: "PT Number",
				accessor: "pawnTicketID",
			},
			{ Header: "Customer Name", accessor: "customerName" },
			{
				Header: "Loan Amount",
				accessor: "loanAmount",
				disableGlobalFilter: true,
			},
			{
				Header: "Clerk",
				accessor: "clerkName",
				disableGlobalFilter: true,
			},
			{
				Header: "Manager",
				accessor: "managerName",
				disableGlobalFilter: true,
			},
			{ Header: "Loan Date", accessor: "loanDate", disableGlobalFilter: true },
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
		router.push({
			pathname: "search/pawnTicket/[pawnTicketID]",
			query: { pawnTicketID: rowData.pawnTicketID },
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
					placeholder={"PT Number or Customer Name"}
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

export default PawnTicketSearch;
