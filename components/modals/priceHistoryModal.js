import React, { useMemo } from "react";
import Close from "../closebutton";
import {
	useTable,
	useSortBy,
	useGlobalFilter,
	usePagination,
} from "react-table";

function PriceHistoryModal({ trigger, setTrigger, data }) {
	const columns = React.useMemo(
		() => [
			{
				Header: "Ask Price",
				accessor: "askPrice",
				disableGlobalFilter: true,
			},
			{
				Header: "Appraisal Price",
				accessor: "appraisalPrice",
				disableGlobalFilter: true,
			},
			{ Header: "Time", accessor: "time", disableGlobalFilter: true },
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
				<div className="px-10 pt-5 pb-10 bg-gray-100 border-2 rounded-xl min-w-fit">
					<div className="ml-[950px] mt-5 mb-5" onClick={() => closeModal()}>
						<Close />
					</div>
					<div>
						<p className="mb-5 text-lg font-bold text-center font-dosis">
							Price History
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
												if (
													cell.column.Header == "Appraisal Price" &&
													row.index == 0
												) {
													return (
														<td
															className="bg-white border border-white"
															key={0}
															{...cell.getCellProps()}
														>
															Php -----
														</td>
													);
												} else if (
													cell.column.Header == "Ask Price" ||
													cell.column.Header == "Appraisal Price"
												) {
													return (
														<td
															className="bg-white border border-white"
															key={0}
															{...cell.getCellProps()}
														>
															Php {cell.render("Cell")}
														</td>
													);
												} else {
													return (
														<td
															className="bg-white border border-white"
															key={0}
															{...cell.getCellProps()}
														>
															{cell.render("Cell")}
														</td>
													);
												}
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

export default PriceHistoryModal;
