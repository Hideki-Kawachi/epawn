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

function ItemReport({
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

	useEffect(() => {
		getData();
	}, [userData, pawnTicketData, itemData, branchData, transactionData]);

	useEffect(() => {
		if (startDate && endDate) {
			// console.log(
			// 	"start is:",
			// 	new Date(new Date(startDate).setHours(0, 0, 0, 0))
			// );
			// console.log(
			// 	"end is:",
			// 	new Date(new Date(endDate).setHours(23, 59, 59, 59))
			// );
			let tempData = data.filter((pt) => {
				let start = new Date(startDate).setHours(0, 0, 0, 0);
				let end = new Date(endDate).setHours(23, 59, 59, 59);
				return (
					new Date(pt.loanDate) >= new Date(start) &&
					new Date(pt.loanDate) <= new Date(endDate)
				);
			});
			// console.log("temp:", tempData);
			setData(tempData);
		} else if (!startDate && !endDate) {
			getData();
		}
	}, [startDate, endDate]);

	function getData() {
		let tempData = [];

		//Get all items
		let tempIDList = [];

		for (const pt of pawnTicketData) {
			let currTransaction = transactionData.find((transac) => {
				// console.log("transac:", transac._id, "--", pt.transactionID);
				return transac._id.toString() == pt.transactionID;
			});

			let currBranch = branchData.find((branch) => {
				return branch.branchID == currTransaction.branchID;

				// return pt.branchID
			});

			for (const item of itemData) {
				if (item.itemListID == pt.itemListID) {
					//If item does not exist in the ID List, extract the items and push it into tempData
					if (!tempIDList.includes(item.itemID)) {
						tempData.push({
							itemID: item.itemID,
							branchName: currBranch.branchName,
							loanDate: dayjs(new Date(pt.loanDate)).format("MMM DD, YYYY"),
							itemType: item.itemType,
							itemCategory: item.itemCategory,
							itemDesc: item.description,
							loanAmount: pt.loanAmount?.toFixed(2),
						});

						tempIDList.push(item.itemID);
					}
				}

				// console.log(tempIDList)
			}

			// console.log("curr:", currTransaction);

			// tempData.push({
			// 	pawnTicketID: pt.pawnTicketID,
			// 	branchName: currBranch.branchName,
			// 	status: status,
			// 	loanDate: dayjs(new Date(pt.loanDate)).format("MMM DD, YYYY"),
			// 	// maturityDate: dayjs(new Date(pt.maturityDate)).format("MMM DD, YYYY"),
			// 	// expiryDate: dayjs(new Date(pt.expiryDate)).format("MMM DD, YYYY"),
			// 	loanAmount: pt.loanAmount?.toFixed(2),
			// });
		}
		setData(tempData);
	}

	const columns = React.useMemo(
		() => [
			{
				Header: "Item ID",
				accessor: "itemID",

				// Header: "PT Number",
				// accessor: "pawnTicketID",
			},
			{ Header: "Branch", accessor: "branchName" },
			{
				Header: "Loan Date",
				accessor: "loanDate",
				filter: "between",
				disableGlobalFilter: true,
			},
			{
				Header: "Item Type",
				accessor: "itemType",
			},
			{
				Header: "Item Category",
				accessor: "itemCategory",
			},
			{
				Header: "Item Description",
				accessor: "itemDesc",
			},
			{
				Header: "Appraisal Price",
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

	function printReport() {
		printReportItemData(data, startDate, endDate);
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
					defaultValue={""}
				>
					<option value={""}>All</option>
					{branchData.map((branch) => (
						<option key={branch.branchName} value={branch.branchName}>
							{branch.branchName}
						</option>
					))}
				</select>
				<button
					className="relative ml-auto text-sm bg-green-300"
					onClick={() => printReport()}
				>
					Generate Report
				</button>
			</div>
			<ItemCategoryReport
				pawnTicketData={pawnTicketData}
				userData={userData}
				itemData={itemData}
				branchData={branchData}
				transactionData={transactionData}
				startDate={startDate}
				endDate={endDate}
				branchFilter={branchID}
			></ItemCategoryReport>

			<ItemTypeReport
				pawnTicketData={pawnTicketData}
				userData={userData}
				itemData={itemData}
				branchData={branchData}
				transactionData={transactionData}
			></ItemTypeReport>

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

export default ItemReport;
