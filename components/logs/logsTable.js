import { useRouter } from "next/router";
import React from "react";
import {
	useFilters,
	useGlobalFilter,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";
import dayjs from "dayjs";

function LogsTable({ data, branchData }) {
	const columns = React.useMemo(
    () => [
      {
        Header: "PT Number",
        accessor: "pawnTicketID",
      },
      {
        Header: "Transaction",
        accessor: "transactionType",
        disableGlobalFilter: true,
      },
      { Header: "Customer Name", accessor: "customerName" },
      {
        Header: "Branch",
        accessor: "branchName",
        disableGlobalFilter: true,
      },
      {
        Header: "Cash In",
        accessor: "cashIn",
        Cell: ({ value }) => {
          return <div className="text-right">{convertFloat(value)}</div>;
        },
        disableGlobalFilter: true,
      },
      {
        Header: "Cash Out",
        accessor: "cashOut",
        Cell: ({ value }) => {
          return <div className="text-right">{convertFloat(value)}</div>;
        },
        disableGlobalFilter: true,
      },
      {
        Header: "Clerk",
        accessor: "clerkName",
        Cell: ({ value }) => {
          return value == null ? (
            <div className="text-center">
              ---------------
            </div>
          ) : (
            <div className="text-center">
              {value}
            </div>
          );
        },
        disableGlobalFilter: true,
      },
      {
        Header: "Manager",
        accessor: "managerName",
        disableGlobalFilter: true,
      },
      { Header: "Date", accessor: "date", disableGlobalFilter: true },
      {
        Header: "Time",
        accessor: "time",
        Cell: ({ value }) => {
          return (
            <div className="text-center ">{dayjs(value).format("h:mm A")}</div>
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

	function openRow(rowData) {
		console.log("ROW DATA IS:", rowData);
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
      <div className="w-full p-10 bg-white border-2 h-[750px] font-nunito">
        <div className="flex w-full gap-2 my-5 text-sm font-nunito">
          <span className="text-sm">Search: </span>
          <input
            className=" text-sm w-96 h-fit"
            onChange={(e) => {
              setGlobalFilter(e.target.value);
            }}
            placeholder={"PT Number or Customer Name"}
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
          <div className="font-dosis text-sm pawn-pagination-container mb-2 ml-[350px]">
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
        </div>
        <table
          {...getTableProps()}
          className="w-full text-sm border text-center"
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
                  onClick={() => openRow(data[row.id])}
                  className={
                    i % 2 === 0
                      ? "text-sm  pl-3  "
                      : "text-sm  bg-gray-150"
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
      </div>
    </>
  );
}

export default LogsTable;
