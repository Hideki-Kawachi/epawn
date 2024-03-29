import Link from "next/link";
import React from "react";

function PawnNav({ role }) {
	const roleShow = {
		clerk: (
			<div
				className="relative flex flex-col gap-2 bg-blue-500 text-[white] font-nunito text-[0.9rem]"
				id="nav-pawn-sub"
			>
				<Link href={"/pawn/clerk/newCustomer"}>
					<a className="p-0 m-0 w-fit">New Customer</a>
				</Link>
				<hr></hr>
				<Link href={"/pawn/clerk/returningCustomer"}>
					<a className="p-0 m-0 w-fit">Returning Customer</a>
				</Link>
				<hr></hr>
				<Link href={"/pawn/clerk/ongoingTransaction/"}>
					<a className="p-0 m-0 w-fit">Ongoing Transactions</a>
				</Link>
			</div>
		),
		manager: (
			<div
				className="relative flex flex-col gap-2 bg-blue-500 text-[white] font-nunito text-[0.9rem]"
				id="nav-pawn-sub"
			>
				<Link href={"/pawn/manager/appraisal"}>
					<a className="p-0 m-0 w-fit">For Appraisal</a>
				</Link>
				<hr></hr>
				<Link href={"/pawn/manager/negotiation"}>
					<a className="p-0 m-0 w-fit">For Negotiation</a>
				</Link>
				<hr></hr>
				<Link href={"/pawn/manager/approval"}>
					<a className="p-0 m-0 w-fit">For Approval</a>
				</Link>
			</div>
		),
	};

	return <>{roleShow[role]}</>;
}

export default PawnNav;
