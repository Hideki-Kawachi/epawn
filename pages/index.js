import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import ClerkHome from "../components/home/clerkHome";
import Header from "../components/header";
import ManagerHome from "../components/home/managerHome";
import NavBar from "../components/navigation/navBar";

export default function Home() {
	const [role, setRole] = useState("clerk");

	const roleShow = {
		manager: <ManagerHome></ManagerHome>,
		clerk: <ClerkHome></ClerkHome>,
	};

	return (
		<div>
			<Head>
				<title>E-Pawn</title>
				<meta
					name="description"
					content="R. Raymundo Pawnshop Information System"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<NavBar></NavBar>
			{roleShow[role]}
		</div>
	);
}
