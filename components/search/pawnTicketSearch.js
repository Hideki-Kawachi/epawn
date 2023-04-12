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

function PawnTicketSearch({
	pawnTicketData,
	userData,
	itemData,
	branchData,
	transactionData,
}) {
	const [data, setData] = useState([{}]);

	useEffect(() => {
		let tempData = [];
		console.log("pt:", pawnTicketData);
		for (const pt of pawnTicketData) {
			let index = 0;
			let customerName;
			let managerName;
			let clerkName;
			let currTransaction = transactionData.find((transac) => {
				return transac._id == pt.transactionID;
			});

			while (
				(!customerName || !clerkName || !managerName) &&
				index != userData.length
			) {
				let currUser = userData[index];
				console.log("CURR USER:", currUser, "--", index);
				if (currUser.userID == pt.customerID) {
					customerName =
						currUser.firstName +
						" " +
						(currUser.middleName.length > 0
							? currUser.middleName.charAt(0) + ". "
							: " ") +
						currUser.lastName;
				} else if (currUser.userID == currTransaction.clerkID) {
					clerkName =
						currUser.firstName +
						" " +
						(currUser.middleName.length > 0
							? currUser.middleName.charAt(0) + ". "
							: " ") +
						currUser.lastName;
				} else if (currUser.userID == currTransaction.managerID) {
					managerName =
						currUser.firstName +
						" " +
						(currUser.middleName.length > 0
							? currUser.middleName.charAt(0) + ". "
							: " ") +
						currUser.lastName;
				}
				index++;
			}
			console.log("customer name:", customerName);
			tempData.push({
				pawnTicketID: pt.pawnTicketID,
				customerName: customerName,
				loanAmount: pt.loanAmount?.toFixed(2),
				clerkName: clerkName ? clerkName : "--------------",
				managerName: managerName,
				loanDate: dayjs(new Date(pt.loanDate)).format("MMM DD, YYYY"),
			});
		}
		setData(tempData);
	}, [userData, pawnTicketData, itemData, branchData, transactionData]);

	const columns = React.useMemo(
    () => [
      {
        Header: "PT Number",
        accessor: "pawnTicketID",
      },
      { Header: "Customer Name", accessor: "customerName" },
      {
        Header: "Loan Amount",
        accessor: "loanAmount",
        Cell: ({ value }) => {
          return convertFloat(value);
        },
        disableGlobalFilter: true,
      },
      {
        Header: "Clerk",
        accessor: "clerkName",
        disableGlobalFilter: true,
      },
      {
        Header: "Manager",
        accessor: "managerName",
        disableGlobalFilter: true,
      },
      { Header: "Loan Date", accessor: "loanDate", disableGlobalFilter: true },
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
			pathname: "search/pawnTicket/[pawnTicketID]",
			query: { pawnTicketID: rowData.pawnTicketID },
		});
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
      <div className="flex items-center self-start  gap-2 my-5 text-sm font-nunito">
        <span className="text-sm">Search: </span>
        <input
          className="text-sm w-96"
          onChange={(e) => {
            setGlobalFilter(e.target.value);
          }}
          placeholder={"PT Number or Customer Name"}
        />
        <div className="font-dosis text-base pawn-pagination-container mb-2 ml-[1005px]">
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
      <table {...getTableProps()} className="w-full text-sm border font-nunito">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                return (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="text-sm text-left py-4 pl-3 font-nunito bg-green-50"
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

export default PawnTicketSearch;
