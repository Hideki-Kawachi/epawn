import { withIronSessionSsr } from "iron-session/next";
import React, { useEffect, useState } from "react";
import { ironOptions } from "../../../utilities/config";

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
		}

		fetch("https://api.paymongo.com/v1/sources/" + sourceID, options2)
			.then((response) => response.json())
			.then((response) => {
				console.log("resres", response);
				localStorage.clear();
			})
			.catch((err) => console.error(err));
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
		<div>
			<span>SUCCESS</span>
		</div>
	);
}

export default Success;
