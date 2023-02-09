import Link from "next/link";
import React, { useState } from "react";

function Header({ currentUser }) {
	function logout() {
		console.log("LOGOUT FUNCTION");
	}
	return (
		<header className="absolute right-5 top-5 w-fit h-fit">
			<span className="text-base font-semibold font-nunito">
				{currentUser} |{" "}
			</span>
			<Link href={"/signIn"}>
				<a
					className="text-base font-semibold text-red-500 font-nunito"
					onClick={() => logout()}
				>
					Logout
				</a>
			</Link>
		</header>
	);
}

export default Header;
