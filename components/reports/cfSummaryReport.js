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

function CFSummaryReport({
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

		for (const currTransaction of transactionData) {
			let currBranch = branchData.find((branch) => {
				return branch.branchID == currTransaction.branchID;
			});


			//If not same transaction date, then create a new element (Else retrieve previous)
			if ( (!tempData.some(obj => obj.transactDate 
					== (dayjs(new Date(currTransaction.creationDate)).format("MMM DD, YYYY"))	)	) ) {
				
				let tempCashIn = 0
				let tempCashOut = 0
				
				//If amount paid is positive then cashin, else false
				if (currTransaction.amountPaid >= 0) {
					tempCashIn = currTransaction.amountPaid.toFixed(2)
				} else {
					tempCashOut = Math.abs(currTransaction.amountPaid.toFixed(2)).toFixed(2)
				}

				//If array length is 0, use current cashin and cashout (Else, get the previous)
				if (tempData.length == 0) {
					tempData.push({
						branchName: currBranch.branchName, 
						transactDate: dayjs(new Date(currTransaction.creationDate)).format("MMM DD, YYYY"),
						cashInAmount: tempCashIn,
						cashOutAmount: tempCashOut,
						netCashFlow: (parseFloat(tempCashIn) - parseFloat(tempCashOut)).toFixed(2),
					})
				} else {
					tempData.push({
						branchName: currBranch.branchName, 
						transactDate: dayjs(new Date(currTransaction.creationDate)).format("MMM DD, YYYY"),
						cashInAmount: tempCashIn,
						cashOutAmount: tempCashOut,
						// netCashFlow: (parseFloat(tempCashIn) - parseFloat(tempCashOut)).toFixed(2)
						// Beginning and End implementation
						netCashFlow: (parseFloat(tempData[tempData.length - 1].netCashFlow) + parseFloat(tempCashIn) - parseFloat(tempCashOut)).toFixed(2),
					})	
				}
					
			}
			else {

				let index = tempData.findIndex(obj => obj.transactDate == (dayjs(new Date(currTransaction.creationDate)).format("MMM DD, YYYY")) )

				let newVal;
				let newTotal;

				//If amountPaid is >= 0, then cashIn
				if (currTransaction.amountPaid >= 0) {
					newVal = parseFloat(tempData[index].cashInAmount) + parseFloat(currTransaction.amountPaid)
					tempData[index].cashInAmount = newVal.toFixed(2)

					newTotal = parseFloat(currTransaction.amountPaid) + parseFloat(tempData[index].netCashFlow) 
					tempData[index].netCashFlow = newTotal.toFixed(2)
				} else {
					newVal = parseFloat(currTransaction.amountPaid) - parseFloat(tempData[index].cashOutAmount)
					tempData[index].cashOutAmount = Math.abs(newVal.toFixed(2)).toFixed(2)

					newTotal = parseFloat(currTransaction.amountPaid) + parseFloat(tempData[index].netCashFlow)
					tempData[index].netCashFlow = (newTotal).toFixed(2)
				}
			}
		}

		let branchList = []

		for (const someItem of tempData) {

			// console.log(someItem)

			if ( !branchList.some((obj) => obj.branchName === someItem.branchName)) {

				branchList.push({
					branchName: someItem.branchName,
					totalCashInAmount: someItem.cashInAmount,
					totalCashOutAmount: someItem.cashOutAmount,
					totalNetCashFlow: someItem.netCashFlow
				})

			} else {

				console.log("hello")

				let index = branchList.findIndex((obj) => obj.branchName == someItem.branchName)
				let newCashIn = parseFloat(branchList[index].totalCashInAmount) + parseFloat(someItem.cashInAmount)

				let newCashOut =  parseFloat(branchList[index].totalCashOutAmount) + parseFloat(someItem.cashOutAmount)
				
				branchList[index].totalCashInAmount = newCashIn.toFixed(2)
				branchList[index].totalCashOutAmount = newCashOut.toFixed(2)

				branchList[index].totalNetCashFlow = someItem.netCashFlow
			}
		}

		

		setData(branchList);
	}

	const columns = React.useMemo(
		() => [
			{ Header: "Branch", accessor: "branchName" },
			{
				Header: "Total Cash In",
				accessor: "totalCashInAmount",
			},
			{
				Header: "Total Cash Out",
				accessor:  "totalCashOutAmount",
			},
			{
				Header: "Net Cash Flow",
				accessor: "totalNetCashFlow",
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
			{/* Filter 
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
			</div> */}
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

export default CFSummaryReport;
