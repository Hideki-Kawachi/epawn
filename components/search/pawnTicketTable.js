import { useRouter } from "next/router";
import React from "react";
import {
	useFilters,
	useGlobalFilter,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";

function PawnTicketTable({ data }) {
	const columns = React.useMemo(
		() => [
			{
				Header: "PT Number",
				accessor: "pawnTicketID",
			},
			{
				Header: "Date of Loan",
				accessor: "loanDate",
				disableGlobalFilter: true,
			},
			{
				Header: "Maturity Date",
				accessor: "maturityDate",
				disableGlobalFilter: true,
			},
			{
				Header: "Expiry Date",
				accessor: "expiryDate",
				disableGlobalFilter: true,
			},
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
		router.push({
			pathname: "/search/pawnTicket/[pawnTicketID]",
			query: { pawnTicketID: rowData.pawnTicketID },
		});
	}

	return (
    <div className="p-5 bg-white border rounded">
      <div className="flex w-full gap-2 my-5 text-sm font-nunito">
        <span className="text-sm">Search: </span>
        <input
          className="text-sm w-96 h-fit"
          onChange={(e) => {
            setGlobalFilter(e.target.value);
          }}
          placeholder={"PT Number"}
        />
        <span className="ml-5">Status: </span>
        <select
          className="h-fit"
          onChange={(e) => setFilter("status", e.target.value)}
          defaultValue={""}
        >
          <option value={""}>All</option>
          <option value={"Active"}>Active</option>
          <option value={"Inactive"}>Inactive</option>
        </select>
        <div className="font-dosis text-base pawn-pagination-container mb-2 ml-[250px]">
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
        className="w-full text-sm border text-center font-nunito"
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
  );
}

export default PawnTicketTable;
