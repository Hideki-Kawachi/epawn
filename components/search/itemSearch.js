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

import itemCategory from "../../utilities/dropdownValues/itemCategory.json";
import itemType from "../../utilities/dropdownValues/itemType.json";

function ItemSearch({ pawnTicketData, userData, itemData }) {
	const [data, setData] = useState([{}]);

	useEffect(() => {
		let tempData = [];

		for (const item of itemData) {
			let index = 0;
			let customerName = "";
			let status = "";

			if (item.isRedeemed) {
				status = "Redeemed";
			} else if (item.forAuction) {
				status = "For Auction";
			} else {
				status = "Pawned";
			}

			while (!customerName && index != pawnTicketData.length) {
				if (pawnTicketData[index].itemListID == item.itemListID) {
					let currUser = userData.filter((user) => {
						return user.userID == pawnTicketData[index].customerID;
					});
					if (currUser) {
						customerName =
							currUser[0].firstName +
							" " +
							(currUser[0].middleName > 0
								? currUser[0].middleName.charAt(0) + ". "
								: " ") +
							currUser[0].lastName;
						tempData.push({
							itemID: item.itemID,
							itemName: item.itemName,
							itemCategory: item.itemCategory,
							itemType: item.itemType,
							price: item.price.toFixed(2),
							customerName: customerName,
							status: status,
						});
					}
				}
				index++;
			}
		}
		setData(tempData);
	}, [userData, pawnTicketData, itemData]);

	const columns = React.useMemo(
		() => [
			{
				Header: "Item ID",
				accessor: "itemID",
			},
			{
				Header: "Name",
				accessor: "itemName",
				disableGlobalFilter: true,
			},
			{
				Header: "Category",
				accessor: "itemCategory",
				disableGlobalFilter: true,
			},
			{
				Header: "Type",
				accessor: "itemType",
				disableGlobalFilter: true,
			},
			{
				Header: "Appraisal Price",
				accessor: "price",
				disableGlobalFilter: true,
			},
			{
				Header: "Customer Name",
				accessor: "customerName",
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
			pathname: "/search/item/[itemID]",
			query: { itemID: rowData.itemID },
		});
	}

	return (
    <div>
      <div className="flex gap-2 my-5 text-sm font-nunito">
        <span className="text-sm">Search: </span>
        <input
          className="w-96 text-sm h-fit"
          onChange={(e) => {
            setGlobalFilter(e.target.value);
          }}
          placeholder={"Item ID"}
        />
        <span className="ml-5">Category: </span>
        <select
          className="h-fit"
          onChange={(e) => setFilter("itemCategory", e.target.value)}
          defaultValue={""}
        >
          <option value={""}>All</option>
          {itemCategory.map((category) => (
            <option key={category.itemCategory} value={category.itemCategory}>
              {category.itemCategory}
            </option>
          ))}
        </select>
        <span className="ml-5">Type: </span>
        <select
          className="h-fit"
          onChange={(e) => setFilter("itemType", e.target.value)}
          defaultValue={""}
        >
          <option value={""}>All</option>
          {itemType.map((type) => (
            <option key={type.itemType} value={type.itemType}>
              {type.itemType}
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
          <option value={"Pawned"}>Pawned</option>
          <option value={"Redeemed"}>Redeemed</option>
          <option value={"For Auction"}>For Auction</option>
        </select>

        <div className="font-dosis text-base pawn-pagination-container ml-96 h-fit">
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
                if (
                  column.Header !== "Transaction" &&
                  column.Header.toString() !== "Status"
                ) {
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
                }

                return (
                  <th
                    {...column.getHeaderProps()}
                    className="text-sm text-left py-4 pl-3 font-nunito bg-green-50"
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

export default ItemSearch;
