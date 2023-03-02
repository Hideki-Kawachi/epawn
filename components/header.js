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
		<header className="absolute right-5 top-5 w-fit h-fit">
			<span className="text-base font-semibold font-nunito">
				{currentUser.lastName}, {currentUser.firstName} |{" "}
			</span>
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
