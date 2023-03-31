import dayjs from "dayjs";
import { withIronSessionSsr } from "iron-session/next";
import React, { useEffect, useState } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import Item from "../../../schemas/item";
import { ironOptions } from "../../../utilities/config";
import dbConnect from "../../../utilities/dbConnect";

import Image from "next/image";
import PawnTicket from "../../../schemas/pawnTicket";
import User from "../../../schemas/user";
import Transaction from "../../../schemas/transaction";
import mongoose from "mongoose";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		if (!req.session.userData && !query) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (
			req.session.userData.role == "manager" ||
			req.session.userData.role == "admin" ||
			(req.session.userData.role == "clerk" && query.itemID.length <= 9)
		) {
			await dbConnect();
			let itemInfo = await Item.findOne({
				itemID: query.itemID,
			});

			if (itemInfo) {
				let pawnTicketInfo = await PawnTicket.findOne({
					itemListID: itemInfo.itemListID,
				}).sort({ createdAt: 1 });

				let customerInfo = await User.findOne({
					userID: pawnTicketInfo.customerID,
				});

				let transactionInfo = await Transaction.findById(
					new mongoose.Types.ObjectId(pawnTicketInfo.transactionID)
				);

				let managerInfo = await User.findOne({
					userID: transactionInfo.managerID,
				});

				return {
					props: {
						currentUser: req.session.userData,
						itemData: JSON.parse(JSON.stringify(itemInfo)),
						managerData: JSON.parse(JSON.stringify(managerInfo)),
						customerData: JSON.parse(JSON.stringify(customerInfo)),
					},
				};
			} else {
				return {
					redirect: { destination: "/", permanent: true },
					props: {},
				};
			}
		} else {
			return {
				redirect: { destination: "/", permanent: true },
				props: {},
			};
		}
	},
	ironOptions
);

function SearchItemID({ currentUser, itemData, customerData, managerData }) {
	const itemCategoryShow = {
		Gold: (
			<>
				<div className="flex flex-col gap-2 font-bold text-right">
					<p>Category: </p>
					<p>Weight: </p>
					<p>Color: </p>
					<p>Purity: </p>
					<p>Brand: </p>
					<p>Model: </p>
					<p>Description</p>
				</div>
				<div className="flex flex-col gap-2 ml-5 text-left">
					<p>{itemData.itemCategory}</p>
					<p>{itemData.weight} g</p>
					<p>{itemData.color}</p>
					<p>{itemData.purity} </p>
					{itemData.brand.length > 0 ? (
						<p>{itemData.brand}</p>
					) : (
						<p>---------</p>
					)}
					{itemData.model.length > 0 ? (
						<p>{itemData.model}</p>
					) : (
						<p>---------</p>
					)}
					{itemData.description.length > 0 ? (
						<p>{itemData.description}</p>
					) : (
						<p>---------</p>
					)}
				</div>
			</>
		),
		Platinum: (
			<>
				<div className="flex flex-col gap-2 font-bold text-right">
					<p>Category: </p>
					<p>Weight: </p>
					<p>Purity: </p>
					<p>Brand: </p>
					<p>Model: </p>
					<p>Description</p>
				</div>
				<div className="flex flex-col gap-2 ml-5 text-left">
					<p>{itemData.itemCategory}</p>
					<p>{itemData.weight} g</p>
					<p>{itemData.purity} </p>
					{itemData.brand.length > 0 ? (
						<p>{itemData.brand}</p>
					) : (
						<p>---------</p>
					)}
					{itemData.model.length > 0 ? (
						<p>{itemData.model}</p>
					) : (
						<p>---------</p>
					)}
					{itemData.description.length > 0 ? (
						<p>{itemData.description}</p>
					) : (
						<p>---------</p>
					)}
				</div>
			</>
		),
		Diamond: (
			<>
				<div className="flex flex-col gap-2 font-bold text-right">
					<p>Category: </p>
					<p>Weight: </p>
					<p>Clarity: </p>
					<p>Color: </p>
					<p>Shape: </p>
					<p>Quantity:</p>
					<p>Description</p>
				</div>
				<div className="flex flex-col gap-2 ml-5 text-left">
					<p>{itemData.itemCategory}</p>
					<p>{itemData.weight} g</p>
					<p>{itemData.clarity} </p>
					<p>{itemData.color}</p>
					<p>{itemData.shape}</p>
					<p>{itemData.quantity}</p>
					{itemData.description.length > 0 ? (
						<p>{itemData.description}</p>
					) : (
						<p>---------</p>
					)}
				</div>
			</>
		),
		Others: (
			<>
				<div className="flex flex-col gap-2 font-bold text-right">
					<p>Category: </p>
					<p>Weight: </p>
					<p>Brand: </p>
					<p>Model: </p>
					<p>Description</p>
				</div>
				<div className="flex flex-col gap-2 ml-5 text-left">
					<p>{itemData.itemCategory}</p>
					<p>{itemData.weight} g</p>
					{itemData.brand.length > 0 ? (
						<p>{itemData.brand}</p>
					) : (
						<p>---------</p>
					)}
					{itemData.model.length > 0 ? (
						<p>{itemData.model}</p>
					) : (
						<p>---------</p>
					)}
					{itemData.description.length > 0 ? (
						<p>{itemData.description}</p>
					) : (
						<p>---------</p>
					)}
				</div>
			</>
		),
	};
	return (
		<>
			<NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>
			<div id="main-content-area">
				<div className="w-3/4 p-5 text-base border-2 border-b-0 bg-green-50 font-nunito">
					<div className="flex flex-row items-end w-full gap-5">
						<div className="relative w-1/4 aspect-square h-1/4">
							<Image src={itemData.image} layout="fill"></Image>
						</div>
						<div className="flex flex-col justify-center h-full item-center w-fit">
							<h1 className="text-lg font-bold font-nonito">
								{itemData.itemName}
							</h1>
							<span className="text-base font-semibold">
								Item ID: {itemData.itemID}
							</span>
							<span className="mt-5 text-base font-bold whitespace-nowrap">
								Appraisal Price: Php {itemData.price.toFixed(2)}
							</span>
						</div>
						<div></div>
					</div>
				</div>
				<div className="flex flex-row w-3/4 h-full bg-white border-2 border-t-0">
					<div className="flex flex-col w-1/4 gap-2 p-5 text-sm min-w-fit">
						<span>
							<b>Pawned By:</b>{" "}
							{customerData.firstName +
								" " +
								(customerData.middleName.length > 0
									? customerData.middleName.charAt(0) + " ."
									: " ") +
								customerData.lastName}
						</span>
						<span>
							<b>Appraised By:</b>{" "}
							{managerData.firstName +
								" " +
								(managerData.middleName.length > 0
									? managerData.middleName.charAt(0) + " ."
									: " ") +
								managerData.lastName}
						</span>
					</div>
					<div className="flex flex-row p-5 text-sm font-nunito">
						{itemCategoryShow[itemData.itemCategory]}
					</div>
				</div>
			</div>
		</>
	);
}

export default SearchItemID;
