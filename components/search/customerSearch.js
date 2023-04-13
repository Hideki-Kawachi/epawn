import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
	useFilters,
	useGlobalFilter,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";
import Modal from "react-modal";
import CustomerDetails from "../modals/customerDetails";

function CustomerSearch({
	userData,
	transactionData,
	pawnTicketData,
	itemData,
}) {
	const [data, setData] = useState([{}]);

	const columns = React.useMemo(
    () => [
      {
        Header: "Customer ID",
        accessor: "userID",
      },
      { Header: "Customer Name", accessor: "customerName" },
      {
        Header: "Current Total Loan Amount",
        accessor: "totalLoanAmount",
        Cell: ({ value }) => {
          return (
            <div className="text-right  ml-[-200px] mr-40">
              {convertFloat(value)}
            </div>
          );
        },
        disableGlobalFilter: true,
      },
      {
        Header: "Ongoing Pawn Tickets",
        accessor: "ongoingPawnTicket",
        disableGlobalFilter: true,
      },
      {
        Header: "Current Pawned Items",
        accessor: "totalPawnedItems",
        disableGlobalFilter: true,
      },
    ],
    []
  );

	useEffect(() => {
		let tempData = [];
		console.log("user:", userData);
		console.log("pt:", pawnTicketData);
		console.log("trans:", transactionData);
		console.log("item:", itemData);

		for (const user of userData) {
			if (user.role == "customer") {
				let customerName =
					user.firstName +
					" " +
					(user.middleName.length > 0
						? user.middleName.charAt(0) + ". "
						: " ") +
					user.lastName;
				let ongoingPawnTicket = 0;
				let totalPawnedItems = 0;
				let totalLoanAmount = 0;
				let itemListIDs = [];

				pawnTicketData.forEach((pt) => {
					if (pt.customerID == user.userID && !pt.isInactive) {
						totalLoanAmount += pt.loanAmount;

						if (!itemListIDs.includes(pt.itemListID) && pt.itemListID) {
							itemListIDs.push(pt.itemListID);
						}
					}
				});

				itemListIDs.forEach((itemListID) => {
					let currentItemList = itemData.filter((item) => {
						return (
							item.itemListID == itemListID &&
							!item.isRedeemed &&
							!item.forAuction
						);
					});
					totalPawnedItems += currentItemList.length;
				});

				if (customerName) {
					tempData.push({
						userID: user.userID,
						customerName: customerName,
						totalLoanAmount: totalLoanAmount
							? totalLoanAmount.toFixed(2)
							: "0.00",
						ongoingPawnTicket: itemListIDs.length,
						totalPawnedItems: totalPawnedItems,
					});
				}
			}
		}
		setData(tempData);
	}, [userData, transactionData, pawnTicketData, itemData]);

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
		console.log("row:", rowData);
		router.push({
			pathname: "search/customer/[customerID]",
			query: { customerID: rowData.userID },
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
      <div className="flex items-center self-start gap-2 my-5 text-sm font-nunito">
        <span className="text-sm">Search: </span>
        <input
          className="text-sm w-96"
          onChange={(e) => {
            setGlobalFilter(e.target.value);
          }}
          placeholder={"Customer ID or Name"}
        />
        <div className="font-dosis text-base pawn-pagination-container mb-2 ml-[800px]">
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
      <table {...getTableProps()} className="w-full text-sm border text-center font-nunito">
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

export default CustomerSearch;
