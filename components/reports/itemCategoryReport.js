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

function ItemCategoryReport({
	pawnTicketData,
	userData,
	itemData,
	branchData,
	transactionData,
	startDate,
	endDate,
	branchFilter,
	statusFilter,
	typeFilter,
	categoryFilter,
}) {
	const [data, setData] = useState([{}]);

	useEffect(() => {
		getData(pawnTicketData);
	}, [
		userData,
		pawnTicketData,
		itemData,
		branchData,
		transactionData,
		statusFilter,
		typeFilter,
		categoryFilter,
	]);

	useEffect(() => {
		if (startDate && endDate) {
			let ptData;
			if (branchFilter == "") {
				ptData = pawnTicketData.filter((pt) => {
					let start = new Date(startDate).setHours(0, 0, 0, 0);
					let end = new Date(endDate).setHours(23, 59, 59, 59);
					return (
						new Date(pt.loanDate) >= new Date(start) &&
						new Date(pt.loanDate) <= new Date(end)
					);
				});
			} else {
				let transacData = transactionData.filter((transac) => {
					return transac.branchID == branchFilter;
				});

				ptData = pawnTicketData.filter((pt) => {
					let start = new Date(startDate).setHours(0, 0, 0, 0);
					let end = new Date(endDate).setHours(23, 59, 59, 59);
					let found = transacData.find((transac) => {
						return transac._id.toString() == pt.transactionID;
					});
					return (
						new Date(pt.loanDate) >= new Date(start) &&
						new Date(pt.loanDate) <= new Date(end) &&
						found
					);
				});
			}

			getData(ptData);
		} else if (!startDate && !endDate) {
			let ptData;
			if (branchFilter == "") {
				ptData = pawnTicketData;
			} else {
				let transacData = transactionData.filter((transac) => {
					return transac.branchID == branchFilter;
				});

				ptData = pawnTicketData.filter((pt) => {
					let found = transacData.find((transac) => {
						return transac._id.toString() == pt.transactionID;
					});
					return found;
				});
			}
			getData(ptData);
		}
	}, [startDate, endDate, branchFilter]);

	function getData(ptData) {
		//Get all items
		let tempIDList = [];

		let itemCatList = [];

		for (const pt of ptData) {
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
					if (
						(item.itemType == typeFilter || !typeFilter) &&
						(item.itemCategory == categoryFilter || !categoryFilter)
					) {
						if (!tempIDList.includes(item.itemID)) {
							if (
								statusFilter == "Pawned" &&
								!item.isRedeemed &&
								!item.forAuction
							) {
								if (
									!itemCatList.some(
										(obj) => obj.itemCategory === item.itemCategory
									)
								) {
									itemCatList.push({
										itemCategory: item.itemCategory,
										loanAmount: item.price.toFixed(2),
									});
								} else {
									let index = itemCatList.findIndex(
										(obj) => obj.itemCategory == item.itemCategory
									);
									let newVal =
										parseFloat(itemCatList[index].loanAmount) +
										item.price.loanAmount;
									itemCatList[index].loanAmount = newVal.toFixed(2);
								}
								tempIDList.push(item.itemID);
							} else if (statusFilter == "Redeemed" && item.isRedeemed) {
								if (
									!itemCatList.some(
										(obj) => obj.itemCategory === item.itemCategory
									)
								) {
									itemCatList.push({
										itemCategory: item.itemCategory,
										loanAmount: item.price.toFixed(2),
									});
								} else {
									let index = itemCatList.findIndex(
										(obj) => obj.itemCategory == item.itemCategory
									);
									let newVal =
										parseFloat(itemCatList[index].loanAmount) + item.price;
									itemCatList[index].loanAmount = newVal.toFixed(2);
								}
								tempIDList.push(item.itemID);
							} else if (statusFilter == "For Auction" && item.forAuction) {
								if (
									!itemCatList.some(
										(obj) => obj.itemCategory === item.itemCategory
									)
								) {
									itemCatList.push({
										itemCategory: item.itemCategory,
										loanAmount: item.price.toFixed(2),
									});
								} else {
									let index = itemCatList.findIndex(
										(obj) => obj.itemCategory == item.itemCategory
									);
									let newVal =
										parseFloat(itemCatList[index].loanAmount) + item.price;
									itemCatList[index].loanAmount = newVal.toFixed(2);
								}
								tempIDList.push(item.itemID);
							} else if (statusFilter == "") {
								if (
									!itemCatList.some(
										(obj) => obj.itemCategory === item.itemCategory
									)
								) {
									itemCatList.push({
										itemCategory: item.itemCategory,
										loanAmount: item.price.toFixed(2),
									});
								} else {
									let index = itemCatList.findIndex(
										(obj) => obj.itemCategory == item.itemCategory
									);
									let newVal =
										parseFloat(itemCatList[index].loanAmount) + item.price;
									itemCatList[index].loanAmount = newVal.toFixed(2);
								}
								tempIDList.push(item.itemID);
							}
						}
					}
				}
			}
		}

		// itemTypeList = itemTypeList.map(obj => obj.loanAmount.toFixed(2));

		setData(itemCatList);
	}

	const columns = React.useMemo(
		() => [
			// {
			// 	Header: "Item Type",
			// 	accessor: "itemType",
			// },
			{
				Header: "Item Category",
				accessor: "itemCategory",
				Cell: ({ value }) => {
					return <div className="px-20 text-center">{value}</div>;
				},
			},
			{
				Header: "Appraisal Price",
				accessor: "loanAmount",
				Cell: ({ value }) => {
					return (
						<div className="pl-10 pr-20 text-right">{convertFloat(value)}</div>
					);
				},
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
		printReportPTData(data, startDate, endDate);
	}

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
			<div>
				<p className="my-5 text-base font-semibold text-center text-green-500 font-dosis">
					Appraisal Price Summary (Item Category)
				</p>
			</div>
			<div className="flex items-center justify-center">
				<table
					{...getTableProps()}
					className="w-2/5 text-sm border font-nunito"
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
								>
									{row.cells.map((cell) => {
										return (
											<td
												{...cell.getCellProps()}
												className={
													i % 2 === 0 ? "text-sm " : "text-sm  bg-gray-150"
												}
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
			</div>
		</>
	);
}

export default ItemCategoryReport;
