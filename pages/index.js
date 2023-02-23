import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ClerkHome from "../components/home/clerkHome";
import Header from "../components/header";
import ManagerHome from "../components/home/managerHome";
import NavBar from "../components/navigation/navBar";
import dbConnect from "../utilities/dbConnect";
import mongoose from "mongoose";
import Test from "../schemas/test";
import NotifTable from "./api/notifTable";

export async function getServerSideProps() {
	// dbConnect();
	let all = {};
	// console.log("server side props");
	// Test.watch().on("change", async (data) => {
	// 	let all = await Test.find({});
	// 	console.log("on change NotifTable", all);
	// 	return { props: { message: all } };
	// });

	return { props: { message: all } };
}

export default function Home({ message }) {
	const [role, setRole] = useState("clerk");
	const [showData, setShowData] = useState({});

	const roleShow = {
		manager: <ManagerHome></ManagerHome>,
		clerk: <ClerkHome></ClerkHome>,
	};

	function buttonClick() {
		fetch("/api/buttonClick", {
			method: "POST",
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("POST DATA IS:", data);
			});
	}

	useEffect(() => {
		waitNotif();
	}, []);

	async function waitNotif() {
		console.log("wait notif");
		let res = await fetch("/api/notifTable", {
			method: "GET",
		});

		if (res.status == 502) {
			await waitNotif();
		} else if (res.status != 200) {
			console.log("2-RESPONSE:", res.statusText);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} else {
			let message = await res.text();
			setShowData(message);

			await waitNotif();
		}
	}

	useEffect(() => {
		console.log("HERE IS THE RESULT:", showData);
	}, [showData]);

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
			<button onClick={() => buttonClick()}>HELLO WORLD</button>
		</div>
	);
}
