import React, {useMemo} from "react";
import Close from "../closebutton";
import pawnhistoryMock from "../tempData/pawnhistory_MOCK.json";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

function PawnHistory({trigger, setTrigger}) {
  const data = React.useMemo(() => pawnhistoryMock, [])
  	const columns = React.useMemo(
      () => [

        { Header: "PT Number", accessor: "PT Number" },
        {
          Header: "Transaction",
          accessor: "Transaction Type",
          disableGlobalFilter: true,
        },
        { Header: "Branch", accessor: "Branch", disableGlobalFilter: true },
        { Header: "Date", accessor: "Date", disableGlobalFilter: true },
        {
          Header: "Amount Paid",
          accessor: "Amount Paid",
          disableGlobalFilter: true,
        },
        {
          Header: "Loan Amount",
          accessor: "Loan Amount",
          disableGlobalFilter: true,
        },
      ],
      []
    );
      function closeModal() {
        setTrigger(!trigger);
      }
        const {
          getTableProps,
          getTableBodyProps,
          headerGroups,
          page,
          nextPage,
          canNextPage,
          previousPage,
          canPreviousPage,
          gotoPage,
          pageOptions,
          pageCount,
          prepareRow,
          setPageSize,
          state,
          setGlobalFilter,
        } = useTable(
          {
            columns,
            data,
          },

          useGlobalFilter,
          useSortBy,
          usePagination
        );

  return (
    <>
      <div id="modal-content-area">
        <div className="bg-gray-100 border-2 px-10 pb-10 rounded-xl pt-5 min-w-fit">
          <div className="ml-[950px] mt-5 mb-5" onClick={closeModal}>
            <Close />
          </div>
          <div>
            <p className="font-dosis font-bold text-lg text-center mb-5">
              Pawn History of A-XXXX
            </p>
          </div>
          <div>
            <table
              className="table-auto text-sm font-nunito text-center w-[950px] h-80 divide-y divide-gray-200 border border-separate rounded-t-xl bg-green-300"
              {...getTableProps()}
            >
              <thead className="">
                {headerGroups.map((headerGroup) => (
                  <tr
                    id="btable"
                    className=""
                    key={0}
                    {...headerGroup.getHeaderGroupProps()}
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        className=""
                        key={0}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? "▼"
                              : "▲"
                            : " "}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr id="btable" key={0} {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td
                            className="border border-white bg-white"
                            key={0}
                            {...cell.getCellProps()}
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
        </div>
      </div>
    </>
  );
}

export default PawnHistory;
