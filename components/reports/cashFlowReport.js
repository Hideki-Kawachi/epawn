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
import printReportCF from "../../utilities/printReportCF";
import CFSummaryReport from "./cfSummaryReport";

function CashFlowReport({
	pawnTicketData,
	userData,
	itemData,
	branchData,
	transactionData,
}) {
	const [data, setData] = useState([{}]);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [branchID, setBranchID] = useState("");

	useEffect(() => {
		getData(startDate, endDate, branchID);
	}, [
		userData,
		pawnTicketData,
		itemData,
		branchData,
		transactionData,
		startDate,
		endDate,
		branchID,
	]);

	function convertFloat(number) {
		return (
			"Php " +
			Number(number).toLocaleString("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})
		);
	}

	function getData(startDate, endDate, branchID) {
		let tempData = [];

		let tempTransac = transactionData;
		if (startDate && endDate) {
			tempTransac = tempTransac.filter((currTransac) => {
				let start = new Date(startDate).setHours(0, 0, 0, 0);
				let end = new Date(endDate).setHours(23, 59, 59, 59);
				return (
					new Date(currTransac.createdAt) >= new Date(start) &&
					new Date(currTransac.createdAt) <= new Date(end)
				);
			});
		}
		if (branchID != "") {
			tempTransac = tempTransac.filter((transac) => {
				return transac.branchID == branchID;
			});
		}

		console.log("temp transac", tempTransac);

		for (const currTransaction of tempTransac) {
			let currBranch = branchData.find((branch) => {
				return branch.branchID == currTransaction.branchID;
			});

			//If not same transaction date, then create a new element (Else retrieve previous)
			if (
				!tempData.some(
					(obj) =>
						obj.transactDate ==
						dayjs(new Date(currTransaction.creationDate)).format("MMM DD, YYYY")
				) ||
				!tempData.some((obj) => obj.branchName == currBranch.branchName)
			) {
				let tempCashIn = 0;
				let tempCashOut = 0;

				//If amount paid is positive then cashin, else false
				if (currTransaction.amountPaid >= 0) {
					tempCashIn = currTransaction.amountPaid;
				} else {
					tempCashOut = Math.abs(currTransaction.amountPaid);
				}

				tempData.push({
					branchName: currBranch.branchName,
					transactDate: dayjs(new Date(currTransaction.creationDate)).format(
						"MMM DD, YYYY"
					),
					cashInAmount: tempCashIn,
					cashOutAmount: tempCashOut,
					netCashFlow: Number(tempCashIn) - Number(tempCashOut),
				});
			} else {
				let index = tempData.findIndex(
					(obj) =>
						obj.transactDate ==
							dayjs(new Date(currTransaction.creationDate)).format(
								"MMM DD, YYYY"
							) && obj.branchName == currBranch.branchName
				);

				let newVal;
				let newTotal;

				let currAmountPaid = currTransaction.amountPaid;

				//If amountPaid is >= 0, then cashIn
				if (currAmountPaid >= 0) {
					newVal = Number(tempData[index].cashInAmount) + currAmountPaid;
					tempData[index].cashInAmount = newVal;

					newTotal = currAmountPaid + tempData[index].netCashFlow;
					tempData[index].netCashFlow = newTotal;
				} else {
					newVal = currAmountPaid - Number(tempData[index].cashOutAmount);
					tempData[index].cashOutAmount = Math.abs(newVal);

					newTotal = currAmountPaid + tempData[index].netCashFlow;
					tempData[index].netCashFlow = newTotal;
				}
			}
		}

		tempData.forEach((row) => {
			row.cashInAmount = convertFloat(row.cashInAmount);
			row.cashOutAmount = convertFloat(row.cashOutAmount);
			row.netCashFlow = convertFloat(row.netCashFlow);
		});

		setData(tempData);
	}

	function branchFilter(branchName) {
		setFilter("branchName", branchName);
		if (branchName != "") {
			let currBranch = branchData.find((branch) => {
				return branch.branchName == branchName;
			});
			setBranchID(currBranch.branchID);
		} else {
			setBranchID("");
		}
	}

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
				Header: "Date",
				accessor: "transactDate",
				Cell: ({ value }) => {
					return <div className="px-10 text-center">{value}</div>;
				},
				filter: "between",
				disableGlobalFilter: true,
			},
			{
				Header: "Cash In",
				Cell: ({ value }) => {
					return <div className="text-right ml-[-60px] mr-20">{value}</div>;
				},
				accessor: "cashInAmount",
			},
			{
				Header: "Cash Out",
				Cell: ({ value }) => {
					return <div className="text-right ml-[-60px] mr-20">{value}</div>;
				},
				accessor: "cashOutAmount",
			},
			{
				Header: "Net Cash Flow",
				accessor: "netCashFlow",
				Cell: ({ value }) => {
					if (value) {
						return parseFloat(value.split(" ")[1].replace(/,/g, "")) < 0 ? (
							<div className="text-right ml-[-40px] mr-32 text-red-500">
								{value}
							</div>
						) : (
							<div className="text-right ml-[-60px] mr-32">{value}</div>
						);
					}
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

	function printReport() {
		printReportCF(data, startDate, endDate);
	}

	return (
		<>
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
					onChange={(e) => branchFilter(e.target.value)}
				>
					<option value={""}>All</option>
					{branchData.map((branch) => (
						<option key={branch.branchName} value={branch.branchName}>
							{branch.branchName}
						</option>
					))}
				</select>
				<div className="mb-2 text-base font-dosis pawn-pagination-container">
					<button
						className="mb-2"
						onClick={() => previousPage()}
						disabled={!canPreviousPage}
					>
						{"<"}
					</button>
					{pageOptions.length > 1 ? (
						<span className="text-sm mt-1.5 font-nunito">
							<strong>{pageIndex + 1}</strong> / {pageOptions.length} pages
						</span>
					) : (
						<span className="text-sm mt-1.5 font-nunito">
							<strong>{pageIndex + 1}</strong> / 1 page
						</span>
					)}
					<button
						className="text-lg"
						onClick={() => nextPage()}
						disabled={!canNextPage}
					>
						{">"}
					</button>{" "}
				</div>
				<button
					className="relative ml-auto text-sm bg-green-300"
					onClick={() => printReport()}
				>
					Generate Report
				</button>
			</div>
			<CFSummaryReport
				pawnTicketData={pawnTicketData}
				userData={userData}
				itemData={itemData}
				branchData={branchData}
				transactionData={transactionData}
				startDate={startDate}
				endDate={endDate}
				branchFilter={branchID}
			></CFSummaryReport>
			{/* Table */}
			<table {...getTableProps()} className="w-full text-sm border font-nunito">
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => {
								return (
									<th
										{...column.getHeaderProps(column.getSortByToggleProps())}
										className="px-10 py-4 text-sm text-center font-nunito bg-green-50"
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
								className={
									i % 2 === 0 ? "text-sm pl-3  " : "text-sm  bg-gray-150"
								}
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
		</>
	);
}

export default CashFlowReport;
