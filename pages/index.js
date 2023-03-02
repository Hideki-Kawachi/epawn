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
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../utilities/config";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "customer") {
			return {
				redirect: { destination: "/customer", permanent: true },
				props: {},
			};
		} else {
			return {
				props: { currentUser: req.session.userData },
			};
		}
	},
	ironOptions
);

export default function Home({ currentUser }) {
	const [showData, setShowData] = useState({});
	console.log("CURRENT USER IS:", currentUser);

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
				// console.log("POST DATA IS:", data);
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
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			{roleShow[currentUser.role]}
			<button onClick={() => buttonClick()}>HELLO WORLD</button>
		</div>
	);
}
