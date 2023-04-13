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

function ItemTypeReport({
	pawnTicketData,
	userData,
	itemData,
	branchData,
	transactionData,
	statusFilter,
	branchFilter,
	startDate,
	endDate,
}) {
	const [data, setData] = useState([{}]);

	useEffect(() => {
		getData();
	}, [
		userData,
		pawnTicketData,
		itemData,
		branchData,
		transactionData,
		branchFilter,
		statusFilter,
		startDate,
		endDate,
	]);

	// useEffect(() => {
	// 	if (startDate && endDate) {
	// 		let tempData = data.filter((pt) => {
	// 			let start = new Date(startDate).setHours(0, 0, 0, 0);
	// 			let end = new Date(endDate).setHours(23, 59, 59, 59);
	// 			return (
	// 				new Date(pt.loanDate) >= new Date(start) &&
	// 				new Date(pt.loanDate) <= new Date(end)
	// 			);
	// 		});
	// 		setData(tempData);
	// 	} else if (!startDate && !endDate) {
	// 		getData();
	// 	}
	// }, [startDate, endDate]);

	function getData() {
		let tempData = [];

		//Get all items
		let tempIDList = [];

		let itemTypeList = [];

		if (startDate && endDate) {
			tempData = pawnTicketData.filter((pt) => {
				let start = new Date(startDate).setHours(0, 0, 0, 0);
				let end = new Date(endDate).setHours(23, 59, 59, 59);
				return (
					new Date(pt.loanDate) >= new Date(start) &&
					new Date(pt.loanDate) <= new Date(end)
				);
			});
		} else {
			tempData = pawnTicketData;
		}

		for (const pt of tempData) {
			let currTransaction = transactionData.find((transac) => {
				// console.log("transac:", transac._id, "--", pt.transactionID);
				return transac._id.toString() == pt.transactionID;
			});

			let currBranch = branchData.find((branch) => {
				return branch.branchID == currTransaction.branchID;

				// return pt.branchID
			});

			if (branchFilter == "" || branchFilter == currBranch.branchID) {
				for (const item of itemData) {
					if (item.itemListID == pt.itemListID) {
						//If item does not exist in the ID List, extract the items and push it into tempData
						if (!tempIDList.includes(item.itemID)) {
							if (statusFilter == "") {
								if (
									!itemTypeList.some((obj) => obj.itemType === item.itemType)
								) {
									itemTypeList.push({
										itemType: item.itemType,
										loanAmount: pt.loanAmount.toFixed(2),
									});
								} else {
									let index = itemTypeList.findIndex(
										(obj) => obj.itemType == item.itemType
									);
									let newVal =
										parseFloat(itemTypeList[index].loanAmount) + pt.loanAmount;
									itemTypeList[index].loanAmount = newVal.toFixed(2);
								}

								tempIDList.push(item.itemID);
							} else if (
								statusFilter == "Pawned" &&
								!item.isRedeemed &&
								!item.forAuction
							) {
								if (
									!itemTypeList.some((obj) => obj.itemType === item.itemType)
								) {
									itemTypeList.push({
										itemType: item.itemType,
										loanAmount: pt.loanAmount.toFixed(2),
									});
								} else {
									let index = itemTypeList.findIndex(
										(obj) => obj.itemType == item.itemType
									);
									let newVal =
										parseFloat(itemTypeList[index].loanAmount) + pt.loanAmount;
									itemTypeList[index].loanAmount = newVal.toFixed(2);
								}

								tempIDList.push(item.itemID);
							} else if (statusFilter == "Redeemed" && item.isRedeemed) {
								if (
									!itemTypeList.some((obj) => obj.itemType === item.itemType)
								) {
									itemTypeList.push({
										itemType: item.itemType,
										loanAmount: pt.loanAmount.toFixed(2),
									});
								} else {
									let index = itemTypeList.findIndex(
										(obj) => obj.itemType == item.itemType
									);
									let newVal =
										parseFloat(itemTypeList[index].loanAmount) + pt.loanAmount;
									itemTypeList[index].loanAmount = newVal.toFixed(2);
								}

								tempIDList.push(item.itemID);
							} else if (statusFilter == "For Auction" && item.forAuction) {
								if (
									!itemTypeList.some((obj) => obj.itemType === item.itemType)
								) {
									itemTypeList.push({
										itemType: item.itemType,
										loanAmount: pt.loanAmount.toFixed(2),
									});
								} else {
									let index = itemTypeList.findIndex(
										(obj) => obj.itemType == item.itemType
									);
									let newVal =
										parseFloat(itemTypeList[index].loanAmount) + pt.loanAmount;
									itemTypeList[index].loanAmount = newVal.toFixed(2);
								}
								tempIDList.push(item.itemID);
							}
						}
					}
				}
			}
		}

		setData(itemTypeList);
	}

	const columns = React.useMemo(
    () => [
      {
        Header: "Item Type",
        accessor: "itemType",
        Cell: ({ value }) => {
          return <div className="text-center px-20">{value}</div>;
        },
      },
      // {
      // 	Header: "Item Category",
      // 	accessor:  "itemCategory",
      // },
      {
        Header: "Appraisal Price",
        accessor: "loanAmount",
        Cell: ({ value }) => {
          return <div className="text-right pl-20 pr-28">{convertFloat(value)}</div>;
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
      {/* Filter  */}
      {/* <div className="flex items-center self-start w-full gap-2 my-5 text-sm font-nunito whitespace-nowrap ">
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
      <p className="font-dosis font-semibold text-base text-center my-5 text-green-500">
        Appraisal Price Summary (Item Type)
      </p>
      <div className="flex justify-center items-center">
        <table
          {...getTableProps()}
          className="w-2/5 text-sm border font-nunito text-center mb-2"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="text-sm text-center py-4 pl-3 font-nunito bg-green-50"
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
                  className="cursor-pointer hover:bg-green-100"
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className={
                          i % 2 === 0
                            ? "text-sm cursor-pointer hover:bg-green-100 pl-3  "
                            : "text-sm cursor-pointer hover:bg-green-100 pl-3  bg-gray-150"
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

export default ItemTypeReport;
