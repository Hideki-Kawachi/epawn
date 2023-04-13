import React, { useEffect, useState } from "react";
import {
	useFilters,
	useGlobalFilter,
	usePagination,
	useTable,
} from "react-table";
import GlobalFilter from "../../../components/globalFilter";
import Modal from "react-modal";
import CustomerDetails from "../../modals/customerDetails";
import InputCustomerDetails from "../../modals/inputCustomerDetails";
import LoadingSpinner from "../../loadingSpinner";

function ReturnTable({ columns, data, setLoading }) {
	const [customerModal, setCustomerModal] = useState(false);
	const [customerData, setCustomerData] = useState({});
	const [userData, setUserData] = useState({});
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
		state: { pageIndex },
	} = useTable(
		{
			columns,
			data,
		},
		useFilters,
		useGlobalFilter,
		usePagination
	);

	function clickUser(userID) {
		fetch(`/api/users/customers/${userID}`, { method: "GET" })
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					setCustomerData(data);
				} else {
					setCustomerData({});
				}
				fetch(`/api/users/${userID}`, { method: "GET" })
					.then((res) => res.json())
					.then((data) => {
						setUserData(data);
					});
			});
	}

	useEffect(() => {
		console.log("user DATA IS:", userData);
		console.log("customer DATA IS:", customerData);
		if (
			Object.keys(userData).length !== 0 &&
			Object.keys(customerData).length !== 0
		) {
			setCustomerModal(true);
		}
	}, [userData]);

	return (
    <>
      <Modal isOpen={customerModal} ariaHideApp={false} className="modal">
        <InputCustomerDetails
          trigger={customerModal}
          setTrigger={setCustomerModal}
          customerInfo={customerData}
          userInfo={userData}
          transactionID
          setLoading={setLoading}
        />
      </Modal>

      <div className="w-3/4 p-10 bg-white border-2 h-[750px]">
        <div className="flex w-full gap-2 my-5 text-base font-nunito">
          <GlobalFilter
            setGlobalFilter={setGlobalFilter}
            placeHolder={"User ID or Name"}
          ></GlobalFilter>
          <div className="font-dosis text-base pawn-pagination-container mb-2 ml-[300px]">
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
          className="w-full text-base font-nunito rounded-t-sm border "
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="text-base text-left py-4 pl-3 font-nunito bg-green-50 "
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  onClick={() => clickUser(row.cells[0].value)}
                  className={
                    i % 2 === 0
                      ? "text-sm cursor-pointer hover:bg-green-100 pl-3 bg-white "
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
    </>
  );
}

export default ReturnTable;
