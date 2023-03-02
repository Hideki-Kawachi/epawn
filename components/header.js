import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ironOptions } from "../utilities/config";

function Header({ currentUser }) {
	const router = useRouter();
	function logout() {
		fetch("/api/logout")
			.then((res) => res.json())
			.then((data) => {
				console.log("DATA IS:", data);
				router.push("/signIn");
			});
	}

	return (
		<header className="absolute flex items-center justify-center gap-3 right-5 top-5 w-fit h-fit">
			<div className="flex flex-col items-end justify-end pr-3 space-y-[-5px] border-r-2 border-gray-500 w-fit h-fit">
				<span className="text-base font-semibold font-nunito">
					{currentUser.lastName}, {currentUser.firstName}
				</span>
				<span className="text-sm capitalize font-nunito">
					{currentUser.role}
				</span>
			</div>
			<a
				className="text-base font-semibold text-red-500 cursor-pointer font-nunito hover:underline"
				onClick={() => logout()}
			>
				Logout
			</a>
		</header>
	);
}

export default Header;
