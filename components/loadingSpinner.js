import React from "react";

function LoadingSpinner({ isLoading }) {
	return (
		<>
			{isLoading ? (
				<>
					<div
						className="fixed z-50 w-full h-full bg-gray-500"
						id="loading-background"
					>
						<span
							className=" top-1/2 left-1/2 fixed z-50 h-[15%] aspect-square"
							id="loading-spinner"
						></span>
					</div>
				</>
			) : (
				<></>
			)}
		</>
	);
}

export default LoadingSpinner;
