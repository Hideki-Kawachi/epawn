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
import ItemCategoryReport from "./itemCategoryReport";
import ItemTypeReport from "./itemTypeReport";
import printReportItemData from "../../utilities/printIReportItemData";

function CashFlowReport({
	pawnTicketData,
	userData,
	itemData,
	branchData,
	transactionData,
}) {
	const [data, setData] = useState([{}]);
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();

	useEffect(() => {
		getData();
	}, [userData, pawnTicketData, itemData, branchData, transactionData]);

	useEffect(() => {
		if (startDate && endDate) {
			console.log(
				"start is:",
				new Date(new Date(startDate).setHours(0, 0, 0, 0))
			);
			console.log(
				"end is:",
				new Date(new Date(endDate).setHours(23, 59, 59, 59))
			);
			let tempData = data.filter((pt) => {
				let start = new Date(startDate).setHours(0, 0, 0, 0);
				let end = new Date(endDate).setHours(23, 59, 59, 59);
				return (
					new Date(pt.loanDate) >= new Date(start) &&
					new Date(pt.loanDate) <= new Date(endDate)
				);
			});
			console.log("temp:", tempData);
			setData(tempData);
		} else if (!startDate && !endDate) {
			getData();
		}
	}, [startDate, endDate]);

	function getData() {
		let tempData = [];

		// //Get all items
		// let tempIDList = [];



		for (const currTransaction of transactionData) {
			let currBranch = branchData.find((branch) => {
				return branch.branchID == currTransaction.branchID;
			});

			if ( (!tempData.some(obj => obj.transactDate 
					== (dayjs(new Date(currTransaction.creationDate)).format("MMM DD, YYYY"))	)	) ) {
				
				
				let tempCashIn = 0
				let tempCashOut = 0
				
				if (currTransaction.amountPaid >= 0) {
					tempCashIn = currTransaction.amountPaid.toFixed(2)
				} else {
					tempCashOut = currTransaction.amountPaid.toFixed(2)
				}

				tempData.push({
					branchName: currBranch.branchName, 
					transactDate: dayjs(new Date(currTransaction.creationDate)).format("MMM DD, YYYY"),
					cashInAmount: tempCashIn,
					cashOutAmount: tempCashOut,
					netCashFlow: (parseFloat(tempCashIn) + parseFloat(tempCashOut)).toFixed(2),
				})
					
			}
			else {

				let index = tempData.findIndex(obj => obj.transactDate == (dayjs(new Date(currTransaction.creationDate)).format("MMM DD, YYYY")) )

				console.log(index)

				let newVal;
				let newTotal;

				if (currTransaction.amountPaid >= 0) {
					newVal = parseFloat(tempData[index].cashInAmount) + parseFloat(currTransaction.amountPaid)
					tempData[index].cashInAmount = newVal.toFixed(2)
				} else {
					newVal = parseFloat(tempData[index].cashOutAmount) + parseFloat(currTransaction.amountPaid)
					tempData[index].cashOutAmount = newVal.toFixed(2)
				}

				if (index != 0){
					newTotal = parseFloat(tempData[index - 1].netCashFlow) + parseFloat(currTransaction.amountPaid)
					tempData[index].netCashFlow = newTotal.toFixed(2)
				} else {
					newTotal = parseFloat(tempData[index].netCashFlow) + parseFloat(currTransaction.amountPaid)
					tempData[index].netCashFlow = newTotal.toFixed(2)
				}


			}
		}

		// for (const pt of pawnTicketData) {
		// 	let currTransaction = transactionData.find((transac) => {
		// 		// console.log("transac:", transac._id, "--", pt.transactionID);
		// 		return transac._id.toString() == pt.transactionID;
		// 	});

		// 	let currBranch = branchData.find((branch) => {
		// 		return branch.branchID == currTransaction.branchID;
		// 	});

		// 		// console.log(tempIDList)
		// 	}

		// 	console.log("curr:", currTransaction);


		// 	// tempData.push({
		// 	// 	pawnTicketID: pt.pawnTicketID,
		// 	// 	branchName: currBranch.branchName,
		// 	// 	status: status,
		// 	// 	loanDate: dayjs(new Date(pt.loanDate)).format("MMM DD, YYYY"),
		// 	// 	// maturityDate: dayjs(new Date(pt.maturityDate)).format("MMM DD, YYYY"),
		// 	// 	// expiryDate: dayjs(new Date(pt.expiryDate)).format("MMM DD, YYYY"),
		// 	// 	loanAmount: pt.loanAmount?.toFixed(2),
		// 	// });
		// }
		setData(tempData);
	}

	const columns = React.useMemo(
		() => [
			{ Header: "Branch", accessor: "branchName" },
			{
				Header: "Date",
				accessor: "transactDate",
				filter: "between",
				disableGlobalFilter: true,
			},
			{
				Header: "Cash In",
				accessor: "cashInAmount",
			},
			{
				Header: "Cash Out",
				accessor:  "cashOutAmount",
			},
			{
				Header: "Net Cash Flow",
				accessor: "netCashFlow",
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

	function printReport() {
		printReportItemData(data, startDate, endDate);
	}

	return (
		<>

			<ItemCategoryReport
				pawnTicketData={pawnTicketData}
				userData={userData}
				itemData={itemData}
				branchData={branchData}
				transactionData={transactionData}
			>
			</ItemCategoryReport>


			{/* Filter  */}
			<div className="flex items-center self-start w-full gap-2 my-5 text-sm font-nunito whitespace-nowrap ">
				<span className="ml-5">Starting Date: </span>
				<input
					type="date"
					onChange={(e) => {
						setStartDate(e.target.value);
					}}
				></input>
				<span className="ml-5">Ending Date: </span>
				<input
					type="date"
					onChange={(e) => {
						setEndDate(e.target.value);
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
					<option value={"Ongoing"}>Ongoing</option>
					<option value={"Inactive"}>Inactive</option>
				</select>
				<button
					className="relative ml-auto text-sm bg-green-300"
					onClick={() => printReport()}
				>
					Generate Report
				</button>
			</div>
			{/* Table */}
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

export default CashFlowReport;
