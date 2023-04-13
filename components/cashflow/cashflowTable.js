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
function CashflowTable({ data }) {
	const columns = React.useMemo(
    () => [
      {
        Header: "Transaction",
        accessor: "transactionType",
        disableGlobalFilter: true,
      },
      {
        Header: "Cash In",
        accessor: "cashIn",
        Cell: ({ value }) => {
          return (
            <div className="ml-[-20px] mr-20 text-right">
              {convertFloat(value)}
            </div>
          );
        },
        disableGlobalFilter: true,
      },
      {
        Header: "Cash Out",
        accessor: "cashOut",
        Cell: ({ value }) => {
          return <div className="ml-[-40px] mr-32 text-right">{convertFloat(value)}</div>;
        },
        disableGlobalFilter: true,
      },
      { Header: "Date", accessor: "date", disableGlobalFilter: true },
      {
        Header: "Time",
        accessor: "time",
        Cell: ({ value }) => {
          return dayjs(value).format("h:mm A");
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
		function convertFloat(number) {
		if (number == null){
			return "Php 0.00"
		}
      else return ("Php " +
        Number(number).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }
	return (
    <div className="p-5 bg-white border rounded">
      <div className="flex w-full gap-2 my-5 text-sm font-nunito">
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
          <option value={"Withdraw"}>Withdraw</option>
          <option value={"Add. Funds"}>Add. Funds</option>
        </select>
        <div className="font-dosis text-base pawn-pagination-container mb-2 ml-[600px]">
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
        className="w-full text-sm font-nunito border text-center"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                if (
                  column.Header !== "Transaction" &&
                  column.Header.toString() !== "Status"
                ) {
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
                }

                return (
                  <th
                    {...column.getHeaderProps()}
                    className="text-sm text-center py-4 pl-3 font-nunito bg-green-50"
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
    </div>
  );
}

export default CashflowTable;
