import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CustomerHeader from "../../../components/customer/header";
import Branch from "../../../schemas/branch";
import { ironOptions } from "../../../utilities/config";
import dbConnect from "../../../utilities/dbConnect";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "customer") {
			return {
				props: {
					currentUser: req.session.userData,
				},
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

function Failed({ currentUser }) {
	const [pawnTicketData, setPawnTicketData] = useState({});
	const router = useRouter();
	useEffect(() => {
		//get payment status
		const options2 = {
			method: "GET",
			headers: {
				accept: "application/json",
				authorization: "Basic c2tfdGVzdF9kaUVONlRCeXBRVlNScEhzcFBWQlhuaUQ=",
			},
		};
		let sourceID = localStorage.getItem("sourceID");
		if (localStorage.getItem("pawnTicketData") != null) {
			setPawnTicketData(JSON.parse(localStorage.getItem("pawnTicketData")));
			fetch("https://api.paymongo.com/v1/sources/" + sourceID, options2)
				.then((response) => response.json())
				.then((response) => {
					localStorage.clear();
				})
				.catch((err) => console.error(err));
		} else {
			router.replace("/customer");
		}
	}, []);

	return (
		<div className="flex flex-col items-center">
			<div className="fixed flex flex-col items-center w-full h-full border-2 md:w-1/4">
				<CustomerHeader></CustomerHeader>
				<div className="flex flex-col items-center w-full h-full pt-[25vh] overflow-y-auto bg-green-50 font-nunito">
					<h1 className="text-lg font-bold">Payment Failed!</h1>
					<div className="flex flex-col gap-4 p-4 text-base text-center">
						<p>Your payment was not accepted, please try again later.</p>
					</div>
					<button
						className="mt-20 text-base bg-green-300"
						onClick={() => router.replace("/customer")}
					>
						Done
					</button>
				</div>
			</div>
		</div>
	);
}

export default Failed;
