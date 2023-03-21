import React from "react";
import NavigationFooter from "../../../components/customer/navigationFooter";
import Image from "next/image";
import CustomerHeader from "../../../components/customer/header";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
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
				props: { currentUser: req.session.userData },
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

function PastTransactions({ currentUser }) {
	return (
		<div className="flex flex-col items-center">
			<div className="fixed flex flex-col items-center w-full h-full border-2 md:w-1/4">
				<CustomerHeader></CustomerHeader>
				<div className="w-full h-full overflow-y-auto bg-green-50 ">
					<div className="flex flex-col items-center w-full h-full mt-[10vh]">
						<span>PAST TRANSACTIONS</span>
					</div>
				</div>
				<NavigationFooter currentUser={currentUser}></NavigationFooter>
			</div>
		</div>
	);
}

export default PastTransactions;
