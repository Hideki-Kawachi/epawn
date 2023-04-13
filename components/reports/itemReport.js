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

	function getData(startDate, endDate, branchID, status) {
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
					let stat;
					if (item.isRedeemed) {
						stat = "Redeemed";
					} else if (item.forAuction) {
						stat = "For Auction";
					} else {
						stat = "Pawned";
					}

					if (!tempIDList.includes(item.itemID)) {
						tempData.push({
							itemID: item.itemID,
							branchName: currBranch.branchName,
							loanDate: dayjs(new Date(pt.loanDate)).format("MMM DD, YYYY"),
							itemType: item.itemType,
							itemCategory: item.itemCategory,
							itemDesc: item.description,
							loanAmount: pt.loanAmount?.toFixed(2),
							status: stat,
						});
						tempIDList.push(item.itemID);
					}
				}
			}
		}

		if (startDate && endDate) {
			tempData = tempData.filter((pt) => {
				let start = new Date(startDate).setHours(0, 0, 0, 0);
				let end = new Date(endDate).setHours(23, 59, 59, 59);
				return (
					new Date(pt.loanDate) >= new Date(start) &&
					new Date(pt.loanDate) <= new Date(end)
				);
			});
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
		console.log("tempData", tempData);
		setData(tempData);
	}

	const columns = React.useMemo(
    () => [
      {
        Header: "Item ID",
        accessor: "itemID",
        Cell: ({ value }) => {
          return <div className="text-center">{value}</div>;
        },

        // Header: "PT Number",
        // accessor: "pawnTicketID",
      },
      {
        Header: "Branch",
        accessor: "branchName",
        Cell: ({ value }) => {
          return <div className="text-center">{value}</div>;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => {
          return <div className="text-center">{value}</div>;
        },
      },
      {
        Header: "Loan Date",
        accessor: "loanDate",
        filter: "between",
        disableGlobalFilter: true,
        Cell: ({ value }) => {
          return <div className="text-center">{value}</div>;
        },
      },
      {
        Header: "Item Type",
        accessor: "itemType",
        Cell: ({ value }) => {
          return <div className="text-center">{value}</div>;
        },
      },
      {
        Header: "Item Category",
        accessor: "itemCategory",

        Cell: ({ value }) => {
          return <div className="text-center">{value}</div>;
        },
      },
      {
        Header: "Item Description",
        accessor: "itemDesc",
        Cell: ({ value }) => {
          return <div className="text-center">{value}</div>;
        },
      },
      {
        Header: "Appraisal Price",
        accessor: "loanAmount",
        Cell: ({ value }) => {
          return (
            <div className="text-right pl-10 pr-20">{convertFloat(value)}</div>
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

	function statsuFilter(value) {
		setFilter("status", value);
		setStatus(value);
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
        <span className="ml-5">Status: </span>
        <select
          className="h-fit"
          onChange={(e) => statsuFilter(e.target.value)}
          defaultValue={""}
        >
          <option value={""}>All</option>
          <option value={"Pawned"}>Pawned</option>
          <option value={"Redeemed"}>Redeemed</option>
          <option value={"For Auction"}>For Auction</option>
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
        statusFilter={status}
      ></ItemCategoryReport>

      <ItemTypeReport
        pawnTicketData={pawnTicketData}
        userData={userData}
        itemData={itemData}
        branchData={branchData}
        transactionData={transactionData}
        branchFilter={branchID}
        statusFilter={status}
        startDate={startDate}
        endDate={endDate}
      ></ItemTypeReport>

      {/* Table */}
      <div className="font-dosis text-base pawn-pagination-container mb-2 ml-[1100px]">
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
      <table {...getTableProps()} className="w-full text-sm border font-nunito">
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
                className={
                  i % 2 === 0
                    ? "text-sm cursor-pointer hover:bg-green-100 pl-3  "
                    : "text-sm cursor-pointer hover:bg-green-100 pl-3  bg-gray-150"
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

export default ItemReport;
