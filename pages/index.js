import Head from "next/head";
import Link from "next/link";
import React from "react";
import Header from "../components/header";
import NavBar from "../components/navBar";

export default function Home() {
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
			{/* <Header currentUser={"Kawachi, Hideki"}></Header> */}
			<NavBar></NavBar>
			<p>test 1</p>
			<Link href="/signIn">GO TO SIGNIN</Link>
		</div>
	);
}
