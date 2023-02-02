import React, { useState } from "react";

function Header({ currentUser }) {
	const [open, setOpen] = useState(false);

	return (
		<header className="flex justify-end w-full px-10 py-5 bg-blue-300">
			<button
				className="flex items-center gap-3 bg-gray-100 border-blue-500"
				onClick={() => setOpen(!open)}
			>
				<span className="text-base font-normal font-nunito">{currentUser}</span>
				{open ? (
					<svg
						width="26"
						height="15"
						viewBox="0 0 26 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="rotate-180"
					>
						<path
							d="M2.82843 0C1.04662 0 0.154284 2.15428 1.41421 3.41421L11.5858 13.5858C12.3668 14.3668 13.6332 14.3668 14.4142 13.5858L24.5858 3.41422C25.8457 2.15429 24.9534 0 23.1716 0H2.82843Z"
							fill="black"
						/>
					</svg>
				) : (
					<svg
						width="26"
						height="15"
						viewBox="0 0 26 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M2.82843 0C1.04662 0 0.154284 2.15428 1.41421 3.41421L11.5858 13.5858C12.3668 14.3668 13.6332 14.3668 14.4142 13.5858L24.5858 3.41422C25.8457 2.15429 24.9534 0 23.1716 0H2.82843Z"
							fill="black"
						/>
					</svg>
				)}
			</button>
			{open ? (
				<div className="absolute top-[4.8rem] bg-blue-100 flex-col flex p-3 border-blue-400 border-2 rounded-md gap-2 items-end">
					<span className="text-sm font-normal cursor-pointer hover:underline font-nunito">
						Account Settings
					</span>
					<span className="text-sm font-normal cursor-pointer hover:underline font-nunito">
						Logout
					</span>
				</div>
			) : (
				<></>
			)}
		</header>
	);
}

export default Header;
