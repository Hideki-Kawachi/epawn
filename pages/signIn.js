import React, { useEffect, useState } from "react";
import Image from "next/image";
import { withIronSessionSsr } from "iron-session/next";
import dbConnect from "../utilities/dbConnect";
import { ironOptions } from "../utilities/config";
import { useRouter } from "next/router";
import LoadingSpinner from "../components/loadingSpinner";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return { props: {} };
		} else if (req.session.userData.role == "customer") {
			return {
				redirect: { destination: "/customer", permanent: true },
				props: {},
			};
		} else {
			return {
				redirect: { destination: "/", permanent: true },
				props: {},
			};
		}
	},
	ironOptions
);

function SignIn() {
	const [userID, setUserID] = useState("");
	const [password, setPassword] = useState("");
	const [isDisabled, setIsDisabled] = useState(false);
	const [error, setError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	function submitForm() {
		let userData = {
			userID: userID,
			password: password,
			disabled: isDisabled,
		};
		setIsLoading(true);
		fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data == "customer") {
					console.log("CUSTOMER");
					router.replace("/customer");
				} else if (data == "employee") {
					console.log("EMPLOYEE");
					router.replace("/");
				} else {
					console.log("ERROR IS:", data);
					setError(true);
				}
			});
	}

	useEffect(() => {
		if (isLoading) setIsLoading(false);
	}, [error]);

	return (
		<>
			<LoadingSpinner isLoading={isLoading}></LoadingSpinner>
			<div className="flex flex-row w-[100vw] h-[100vh]">
				<div className="flex items-center justify-center w-full h-full bg-gray-100">
					<div className="relative w-1/2 aspect-[30/18]">
						<Image
							src={"/logo_transparent.png"}
							layout="fill"
							priority={true}
						></Image>
					</div>
				</div>
				<div className="flex flex-col items-center w-full h-full bg-green-100">
					<div className="w-1/2 text-base font-bold font-nunito">
						<h1 className="text-2xl font-semibold mt-[20vh] mb-20 font-dosis">
							Welcome to R. Raymundo Pawnshop
						</h1>
						<label htmlFor="userID">User ID:</label>
						<input
							type="text"
							id="userID"
							className="w-full mb-5 font-semibold"
							required
							value={userID}
							onChange={(e) => setUserID(e.target.value)}
						></input>

						<label htmlFor="userID">Password:</label>
						<input
							type="password"
							id="password"
							className="w-full font-semibold"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></input>
						<button className="mt-10 bg-green-300" onClick={() => submitForm()}>
							Login
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default SignIn;
