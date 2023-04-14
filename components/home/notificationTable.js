import { useRouter } from "next/router";
import React from "react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import {
	useFilters,
	useGlobalFilter,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";

function NotificationTable({ role, data }) {
	const columns = React.useMemo(
		() => [
			{
				Header: "Transaction",
				accessor: "transactionType",
				disableGlobalFilter: true,
			},
			{ Header: "Customer Name", accessor: "customerName" },
			{ Header: "Date", accessor: "date", disableGlobalFilter: true },
			{ Header: "Time", accessor: "time", disableGlobalFilter: true },
			{ Header: "Status", accessor: "status", disableGlobalFilter: true },
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
			minRows: 10,
		},

		useFilters,
		useGlobalFilter,
		useSortBy,
		usePagination
	);

	const router = useRouter();

	function openRow(rowData) {
		// console.log("rowData", rowData, "==", role);
		// if manager
		if (role == "manager") {
			//if pawn
			//	console.log("row trans:", rowData.transactionType);
			if (rowData.transactionType == "Pawn") {
				if (rowData.status == "For Appraisal") {
					router.push({
						pathname: "/pawn/manager/appraisal/[transactionID]",
						query: { transactionID: rowData._id },
					});
				} else if (rowData.status == "For Negotiation") {
					router.push({
						pathname: "/pawn/manager/negotiation/[transactionID]",
						query: { transactionID: rowData._id },
					});
				} else if (rowData.status == "For Approval") {
					router.push({
						pathname: "/pawn/manager/approval/[transactionID]",
						query: { transactionID: rowData._id },
					});
				}
			}
			// if renew
			else if (rowData.transactionType.includes("Renew")) {
				if (rowData.status == "Pending") {
					//	console.log("pending", rowData);
					router.push({
						pathname: "/renew/manager/[transactionID]",
						query: { transactionID: rowData._id },
					});
				}
			} else if (rowData.transactionType == "Redeem") {
				if (rowData.status == "Pending") {
					router.push({
						pathname: "/redeem/manager/[transactionID]",
						query: { transactionID: rowData._id },
					});
				}
			}
			// console.log("MANAGER", rowData);
		}
		// if clerk
		else if (role == "clerk") {
			//if pawn
			if (rowData.transactionType == "Pawn") {
				if (rowData.status == "Appraised") {
					router.push({
						pathname: "/pawn/clerk/ongoingTransaction/[transactionID]",
						query: { transactionID: rowData._id },
					});
				} else if (rowData.status == "Rejected") {
					router.push({
						pathname: "/pawn/clerk/rejected/[transactionID]",
						query: { transactionID: rowData._id },
					});
				} else if (rowData.status == "Approved") {
					router.push({
						pathname: "/pawn/clerk/approved/[transactionID]",
						query: { transactionID: rowData._id },
					});
				}
			}
			//if renew
			else if (rowData.transactionType == "Renew") {
				if (rowData.status == "Approved") {
					fetch("api/pawn/updateTransactionStatus", {
						method: "POST",
						body: JSON.stringify({
							transactionID: rowData._id,
							status: "Done",
						}),
					});
				}
			} else if (rowData.transactionType == "Redeem") {
				if (rowData.status == "Rejected") {
					router.push({
						pathname: "/redeem/clerk/[rejectTransID]",
						query: { rejectTransID: rowData._id },
					});
				}
			}
			// console.log("CLERK", rowData);
		}
	}
	const [currentTime, setCurrentTime] = useState(dayjs().format("h:mm A"));
	const [currentDate, setCurrentDate] = useState(
		dayjs().format("MMMM D, YYYY")
	);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentTime(dayjs().format("h:mm A"));
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	const isDataEmpty = data.length === 0;

	return (
    <div className="flex flex-col w-full p-10 bg-white border-2 h-[750px]">
      <span className="text-lg font-bold font-nunito">
        {" "}
        Ongoing Transactions{" "}
      </span>
      <span className="text-base font-nunito">
        {" "}
        As of {currentDate} | {currentTime}
      </span>
      <div className="flex items-center justify-center w-full gap-2 my-5 text-sm font-nunito">
        <span className="text-sm">Search: </span>
        <input
          className="w-[250px] text-sm"
          onChange={(e) => {
            setGlobalFilter(e.target.value);
          }}
          placeholder={"PT Number/Customer Name"}
        />
        <span className="ml-5">Transaction: </span>
        <select
          className="h-fit"
          onChange={(e) => setFilter("transactionType", e.target.value)}
          defaultValue={""}
        >
          <option value={""}>All</option>
          <option value={"Pawn"}>Pawn</option>
          <option value={"Renew"}>Renew</option>
          <option value={"Redeem"}>Redeem</option>
        </select>
        <span className="ml-5">Status: </span>
        <select
          className="h-fit"
          onChange={(e) => setFilter("status", e.target.value)}
          defaultValue={""}
        >
          <option value={""}>All</option>
          <option value={"For Appraisal"}>For Appraisal</option>
          <option value={"For Negoation"}>For Negotiation</option>
          <option value={"For Approval"}>For Approval</option>
          <option value={"Appraised"}>Appraised</option>
          <option value={"Pending"}>Pending</option>
          <option value={"Approved"}>Approved</option>
        </select>
        <div className="mb-2 text-base font-dosis pawn-pagination-container mr-5">
          <button
            className="mb-2"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {"<"}
          </button>
          {pageOptions.length > 1 ? (
            <span className="text-sm mt-1.5 font-nunito ">
              <strong>{pageIndex + 1}</strong> / {pageOptions.length} pages
            </span>
          ) : (
            <span className="text-sm mt-1.5 font-nunito ">
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
      </div>
      {!isDataEmpty ? (
        <table
          {...getTableProps()}
          className="w-full text-base rounded-t-sm font-nunito"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={0} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  if (
                    column.Header !== "Transaction" &&
                    column.Header.toString() !== "Status"
                  ) {
                    return (
                      <th
                        key={0}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="py-4 pl-3 text-base text-left font-nunito bg-green-50 "
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
                  }

                  return (
                    <th
                      key={0}
                      {...column.getHeaderProps()}
                      className="pl-3 text-base text-left font-nunito bg-green-50"
                    >
                      {column.render("Header")}
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
                  key={0}
                  {...row.getRowProps()}
                  onClick={() => openRow(data[row.id])}
                  className={
                    i % 2 === 0
                      ? "text-sm cursor-pointer hover:bg-green-100 pl-3  "
                      : "text-sm cursor-pointer hover:bg-green-100 pl-3  bg-gray-150"
                  }
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        key={0}
                        {...cell.getCellProps()}
                        className="py-2 pl-3"
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
      ) : (
        <div>
          <div className="pt-20 pb-32 text-lg font-bold text-center text-gray-400 font-nunito">
            No past transactions
          </div>
        </div>
      )}
      {/* <div className="pawn-pagination-container">
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
      </div> */}
    </div>
  );
}

export default NotificationTable;
