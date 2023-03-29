import React, { useEffect, useState } from "react";

function GlobalFilter({ setGlobalFilter, placeHolder }) {
	const [value, setValue] = useState("");

	useEffect(() => {
		setGlobalFilter(value);
	}, [value]);

	return (
		<div className="flex items-center w-1/2 gap-5 m-5 text-base">
			<span className="text-base">Search: </span>
			<input
				className="w-full"
				value={value || ""}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				placeholder={placeHolder}
			/>
		</div>
	);
}

export default GlobalFilter;
