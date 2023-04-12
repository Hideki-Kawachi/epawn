import { useRouter } from "next/router";
import React from "react";
import {
	useFilters,
	useGlobalFilter,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";

function RenewTable({ role, data }) {
	const columns = React.useMemo(
		() => [
			{
				Header: "Transaction",
				accessor: "transactionType",
				disableGlobalFilter: true,
			},
			{ Header: "PT Number", accessor: "ptNumber" },
			{ Header: "Customer Name", accessor: "customerName" },
			{
				Header: "Total Amount to be Paid",
				accessor: "amountPaid",
				disableGlobalFilter: true,
			},
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
		},

		useFilters,
		useGlobalFilter,
		useSortBy,
		usePagination
	);

	const router = useRouter();

	function openRow(rowData) {
		if (role == "manager") {
			if (rowData.status == "Pending") {
				router.push({
					pathname: "/renew/manager/[transactionID]",
					query: { transactionID: rowData._id },
				});
			}
			// console.log("MANAGER", rowData);
		}
	}

	return (
    <>
      <div className="w-full p-10 bg-white border-2 h-[750px]">
        <div className="flex w-full gap-2 my-5 text-base font-nunito">
          <span className="text-base">Search: </span>
          <input
            className="w-96"
            onChange={(e) => {
              setGlobalFilter(e.target.value);
            }}
            placeholder={"PT Number or Customer Name"}
          />
          <div className="font-dosis text-base pawn-pagination-container mb-2 ml-[1000px]">
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
          className="w-full text-base font-nunito border"
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
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="text-base text-left py-4 pl-3 font-nunito bg-green-50"
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
                      className="text-base text-left py-4 pl-3 font-nunito bg-green-50"
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
                  key={data[row.id]}
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

export default RenewTable;
