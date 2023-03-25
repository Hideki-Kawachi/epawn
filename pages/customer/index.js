import React, { useEffect } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../utilities/config";
import { useRouter } from "next/router";
import Image from "next/image";
import NavigationFooter from "../../components/customer/navigationFooter";
import Link from "next/link";
import CustomerHeader from "../../components/customer/header";

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

function Customer({ currentUser }) {
	const router = useRouter();

	useEffect(() => {
		localStorage.clear();
	}, []);

	return (
		<div className="flex flex-col items-center">
			<div className="fixed flex flex-col items-center w-full h-full border-2 md:w-1/4">
				<CustomerHeader></CustomerHeader>
				<div className="w-full h-full overflow-y-auto bg-green-50 ">
					<div className="flex flex-col items-center w-full h-full mt-[5vh]">
						<Link href={"/customer/pawnTicket/"}>
							<a className="w-1/3 p-4 bg-gray-100 shadow-lg cursor-pointer rounded-3xl hover:translate-y-[-3px] hover:shadow-2xl border-2">
								<svg
									className="w-full h-full"
									viewBox="0 0 35 35"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M8.7513 4.375H26.2513L32.0846 13.125L17.5013 32.0833L2.91797 13.125L8.7513 4.375Z"
										stroke="#19947D"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M18.9596 4.375L23.3346 13.125L17.5013 32.0833L11.668 13.125L16.043 4.375M2.91797 13.125H32.0846"
										stroke="#19947D"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</a>
						</Link>

						<span className="mt-2 mb-10 text-sm font-bold font-nunito">
							My PawnTickets
						</span>
						<Link href={"/customer/pastTransactions/"}>
							<a className="w-1/3 p-4 bg-gray-100 shadow-xl cursor-pointer rounded-3xl hover:translate-y-[-3px] hover:shadow-2xl border-2">
								<svg
									className="w-full h-full"
									viewBox="0 0 49 49"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M27.5618 16.3333H24.4993V26.5417L33.2377 31.7275L34.7077 29.2571L27.5618 25.0104V16.3333ZM26.541 6.125C21.6677 6.125 16.9939 8.06093 13.5479 11.5069C10.1019 14.9529 8.16602 19.6266 8.16602 24.5H2.04102L10.126 32.7279L18.3743 24.5H12.2493C12.2493 20.7096 13.7551 17.0745 16.4353 14.3943C19.1155 11.7141 22.7506 10.2083 26.541 10.2083C30.3314 10.2083 33.9665 11.7141 36.6468 14.3943C39.327 17.0745 40.8327 20.7096 40.8327 24.5C40.8327 28.2904 39.327 31.9255 36.6468 34.6057C33.9665 37.2859 30.3314 38.7917 26.541 38.7917C22.6006 38.7917 19.0277 37.1788 16.4552 34.5858L13.556 37.485C15.2536 39.2013 17.2763 40.5619 19.5058 41.4874C21.7354 42.4128 24.127 42.8846 26.541 42.875C31.4144 42.875 36.0881 40.9391 39.5341 37.4931C42.9801 34.0471 44.916 29.3734 44.916 24.5C44.916 19.6266 42.9801 14.9529 39.5341 11.5069C36.0881 8.06093 31.4144 6.125 26.541 6.125Z"
										fill="#19947D"
									/>
								</svg>
							</a>
						</Link>

						<span className="mt-2 mb-10 text-sm font-bold font-nunito">
							My Past Transactions
						</span>

						<Link href={"/customer/inbox/"}>
							<a className="w-1/3 p-4 bg-gray-100 shadow-xl cursor-pointer rounded-3xl hover:translate-y-[-3px] hover:shadow-2xl border-2">
								<svg
									className="w-full h-full"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M4 20C3.45 20 2.979 19.804 2.587 19.412C2.195 19.02 1.99934 18.5493 2 18V6C2 5.45 2.196 4.979 2.588 4.587C2.98 4.195 3.45067 3.99934 4 4H20C20.55 4 21.021 4.196 21.413 4.588C21.805 4.98 22.0007 5.45067 22 6V18C22 18.55 21.804 19.021 21.412 19.413C21.02 19.805 20.5493 20.0007 20 20H4ZM12 13L4 8V18H20V8L12 13ZM12 11L20 6H4L12 11ZM4 8V6V18V8Z"
										fill="#19947D"
									/>
								</svg>
							</a>
						</Link>
						<span className="mt-2 text-sm font-bold font-nunito  pb-[20vh]">
							My Inbox
						</span>
					</div>
				</div>
				<NavigationFooter currentUser={currentUser}></NavigationFooter>
			</div>
		</div>
	);
}

export default Customer;
