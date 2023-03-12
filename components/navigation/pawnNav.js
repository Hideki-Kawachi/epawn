import Link from "next/link";
import React from "react";

function PawnNav({ role }) {
	const roleShow = {
		clerk: (
			<div className="absolute flex flex-col gap-2 bg-blue-500 left-[100%] text-[white] p-3 font-nunito text-sm w-max">
				<Link href={"/pawn/clerk/newCustomer"}>
					<a className="w-fit">New Customer</a>
				</Link>
				<Link href={"/pawn/clerk/returningCustomer"}>
					<a className="w-fit">Returning Customer</a>
				</Link>
				<Link href={"/pawn/clerk/ongoingTransaction/"}>
					<a className="w-fit">Ongoing Transactions</a>
				</Link>
			</div>
		),
		manager: (
			<div className="absolute flex flex-col gap-2 bg-blue-500 left-[100%] text-[white] p-3 font-nunito text-sm w-max">
				<Link href={"/pawn/manager/appraisal"}>
					<a className="w-fit">For Appraisal</a>
				</Link>
				<Link href={"/pawn/manager/negotiation"}>
					<a className="w-fit">For Negotiation</a>
				</Link>
				<Link href={"/pawn/manager/approval"}>
					<a className="w-fit">For Approval</a>
				</Link>
			</div>
		),
	};

	return <>{roleShow[role]}</>;
}

export default PawnNav;
