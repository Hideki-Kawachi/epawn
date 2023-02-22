import React, { useEffect, useState } from "react";

function GlobalFilter({ setGlobalFilter }) {
	const [value, setValue] = useState("");

	useEffect(() => {
		setGlobalFilter(value);
	}, [value]);

	return (
		<div className="flex items-center w-1/3 gap-5 m-5 text-base">
			<span className="text-base">Search: </span>
			<input
				className="w-full"
				value={value || ""}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				placeholder={"User ID or Name"}
			/>
		</div>
	);
}

export default GlobalFilter;
