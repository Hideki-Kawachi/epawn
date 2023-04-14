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

function Success({ currentUser }) {
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

	useEffect(() => {
		if (JSON.stringify(pawnTicketData) != "{}") {
			fetch("/api/renewal/onlineRenewal", {
				method: "POST",
				body: JSON.stringify({
					pawnTicketData: pawnTicketData,
					currentUser: currentUser,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log("DATA IS:", data);
				});
		}
	}, [pawnTicketData]);
	return (
		<div className="flex flex-col items-center">
			<div className="fixed flex flex-col items-center w-full h-full border-2 md:w-1/4">
				<CustomerHeader></CustomerHeader>
				<div className="flex flex-col items-center w-full h-full pt-[20vh] overflow-y-auto bg-green-50 font-nunito">
					<h1 className="text-lg font-bold">Payment Successful!</h1>
					<div className="flex flex-col gap-4 p-4 text-base text-center">
						<p>
							Please wait for your new PawnTicket to be released within the day.
						</p>
						<b>
							You can pickup the new PawnTicket at our{" "}
							{pawnTicketData.branchName} branch
						</b>
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

export default Success;
