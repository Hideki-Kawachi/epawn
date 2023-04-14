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
import PawnTicketSummaryReport from "./ptSummaryReport";
function PawnTicketReport({
	pawnTicketData,
	userData,
	itemData,
	branchData,
	transactionData,
}) {
	const [data, setData] = useState([{}]);
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [branchID, setBranchID] = useState("");
	const [status, setStatus] = useState("");

	useEffect(() => {
		getData(startDate, endDate, branchID, status);
	}, [
		userData,
		pawnTicketData,
		itemData,
		branchData,
		transactionData,
		startDate,
		endDate,
		branchID,
		status,
	]);

	// useEffect(() => {
	// 	getData();
	// }, [userData, pawnTicketData, itemData, branchData, transactionData]);

	// useEffect(() => {
	// 	if (startDate && endDate) {
	// 		console.log(
	// 			"start is:",
	// 			new Date(new Date(startDate).setHours(0, 0, 0, 0))
	// 		);
	// 		console.log(
	// 			"end is:",
	// 			new Date(new Date(endDate).setHours(23, 59, 59, 59))
	// 		);
	// 		let tempData = data.filter((pt) => {
	// 			let start = new Date(startDate).setHours(0, 0, 0, 0);
	// 			let end = new Date(endDate).setHours(23, 59, 59, 59);
	// 			return (
	// 				new Date(pt.loanDate) >= new Date(start) &&
	// 				new Date(pt.loanDate) <= new Date(endDate)
	// 			);
	// 		});
	// 		console.log("temp:", tempData);
	// 		setData(tempData);
	// 	} else if (!startDate && !endDate) {
	// 		getData();
	// 	}
	// }, [startDate, endDate]);
	function convertFloat(number) {
		return (
			"Php " +
			Number(number).toLocaleString("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})
		);
	}

	function getData(startDate, endDate, branchID, status) {
		let tempData = [];
    	let totalItemPT = 0;
    	let activeItemPT = 0;
		for (const pt of pawnTicketData) {
			let currTransaction = transactionData.find((transac) => {
				// console.log("transac:", transac._id, "--", pt.transactionID);
				return transac._id.toString() == pt.transactionID;
			});

			// console.log("curr:", currTransaction);

			let currBranch = branchData.find((branch) => {
				return branch.branchID == currTransaction.branchID;
			});

			let status = "Ongoing";

			if (pt.isInactive) {
				status = "Inactive";
			}
      else {
        activeItemPT++;
      }

      totalItemPT++;

			tempData.push({
				pawnTicketID: pt.pawnTicketID,
				branchName: currBranch.branchName,
				status: status,
				loanDate: dayjs(new Date(pt.loanDate)).format("MMM DD, YYYY"),
				maturityDate: dayjs(new Date(pt.maturityDate)).format("MMM DD, YYYY"),
				expiryDate: dayjs(new Date(pt.expiryDate)).format("MMM DD, YYYY"),
				loanAmount: convertFloat(pt.loanAmount?.toFixed(2)),
			});
		}

		if (startDate && endDate) {
      totalItemPT = 0;
      activeItemPT = 0;
			tempData = tempData.filter((pt) => {
				let start = new Date(startDate).setHours(0, 0, 0, 0);
				let end = new Date(endDate).setHours(23, 59, 59, 59);
				return (
					new Date(pt.loanDate) >= new Date(start) &&
					new Date(pt.loanDate) <= new Date(end)
				);
			});

			for (const data of tempData) {
				if (status == "Ongoing"){
				activeItemPT++
				}
				totalItemPT++
			}

		}

		if (branchID != "") {
			let currBranch = branchData.find((branch) => {
				return branch.branchID == branchID;
			});
			console.log("curr:", currBranch.branchName);

			tempData = tempData.filter((row) => {
				return row.branchName == currBranch.branchName;
			});
		}

		if (status != "") {
			tempData = tempData.filter((row) => {
				return row.status == status;
			});
		}
    
	setData(tempData);

	}

	const columns = React.useMemo(
		() => [
			{
				Header: "PT Number",
				accessor: "pawnTicketID",
				Cell: ({ value }) => {
					return <div className="px-10 text-center">{value}</div>;
				},
			},
			{
				Header: "Branch",
				accessor: "branchName",
				Cell: ({ value }) => {
					return <div className="px-10 text-center">{value}</div>;
				},
			},
			{
				Header: "Status",
				accessor: "status",
				disableGlobalFilter: true,
				Cell: ({ value }) => {
					return <div className="px-10 text-center">{value}</div>;
				},
			},
			{
				Header: "Loan Date",
				accessor: "loanDate",
				filter: "between",
				disableGlobalFilter: true,
				Cell: ({ value }) => {
					return <div className="px-10 text-center">{value}</div>;
				},
			},
			{
				Header: "Maturity Date",
				accessor: "maturityDate",
				disableGlobalFilter: true,
				Cell: ({ value }) => {
					return <div className="px-10 text-center">{value}</div>;
				},
			},
			{
				Header: "Expiry Date",
				accessor: "expiryDate",
				disableGlobalFilter: true,
				Cell: ({ value }) => {
					return <div className="px-10 text-center">{value}</div>;
				},
			},
			{
				Header: "Loan Amount",
				accessor: "loanAmount",
				Cell: ({ value }) => {
					return <div className="text-right pl-[-20px] pr-10">{value}</div>;
				},
				disableGlobalFilter: true,
			},
		],
		[]
	);

  
	const sumColumns = React.useMemo(
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
				accessor: "maturityDate",
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

	function printReport() {
		printReportPTData(data, startDate, endDate);

		// let header = [
		// 	[
		// 		"PT Number",
		// 		"Branch",
		// 		"Status",
		// 		"Loan Date",
		// 		"Maturity Date",
		// 		"Expiry Date",
		// 		"Amount of Loan",
		// 	],
		// ];
		// const workSheet = utils.json_to_sheet([]);
		// const workBook = utils.book_new();
		// const columnSizes = [
		// 	{ wch: 10 },
		// 	{ wch: 20 },
		// 	{ wch: 15 },
		// 	{ wch: 15 },
		// 	{ wch: 15 },
		// 	{ wch: 15 },
		// 	{ wch: 15 },
		// ];

		// workSheet["!cols"] = columnSizes;
		// utils.sheet_add_aoa(workSheet, header);
		// utils.sheet_add_json(workSheet, data, { origin: "A2", skipHeader: true });
		// utils.book_append_sheet(workBook, workSheet, "PT_Report");
		// writeFileXLSX(
		// 	workBook,
		// 	"PT_Report(" + dayjs().format("MM-DD-YYYY") + ").xlsx",
		// 	{
		// 		bookType: "xlsx",
		// 	}
		// );
	}

	return (
		<>
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
				<div className="mb-2 text-base font-dosis pawn-pagination-container ">
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
			<PawnTicketSummaryReport data={data} userData={userData} branchData={branchData} startDate={startDate} endDate={endDate} pawnTicketData={pawnTicketData} transactionData={transactionData}></PawnTicketSummaryReport>
			<table {...getTableProps()} className="w-full text-sm border font-nunito">
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
		</>
	);
}

export default PawnTicketReport;
