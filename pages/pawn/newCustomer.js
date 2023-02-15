import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import NavBar from "../../components/navigation/navBar";

function NewCustomer() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [askPrice, setAskPrice] = useState(0);
	const [askPriceShow, setAskPriceShow] = useState("0");
	const [itemList, setItemList] = useState([]);

	function isDigit(value) {
		return /^-?\d+$/.test(value);
	}

	function convertPrice(value) {
		let newString = "";

		if (isDigit(value.charAt(value.length - 1))) {
			if (value.includes(",")) {
				let subValues = value.split(",");

				subValues.forEach((subValue) => {
					newString += subValue;
				});
			} else {
				newString = value;
			}
			setAskPrice(parseInt(newString));
			setAskPriceShow(parseInt(newString).toLocaleString("en-US"));
		} else if (askPrice < 9) {
			setAskPrice(0);
			setAskPriceShow("0");
		}
	}

	return (
		<>
			<NavBar></NavBar>
			<Header currentUser={"Kawachi, Hideki"}></Header>
			<div id="main-content-area">
				<div className="font-semibold text-center font-dosis">
					<h1 className="text-2xl underline">PAWN</h1>
					<span className="text-lg">New Customer</span>
				</div>
				<form className="flex gap-40 mt-[5vh] text-base font-nunito">
					<div className="flex flex-col items-end gap-5 w-[30vw]">
						<label htmlFor="firstName">
							First Name:
							<input
								type="text"
								id="firstName"
								className="ml-4"
								required
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							></input>
						</label>
						<label htmlFor="lastName">
							Last Name:
							<input
								type="text"
								id="lastName"
								className="ml-4"
								required
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							></input>
						</label>
						<label htmlFor="middleName">
							Middle Name:
							<input
								type="text"
								id="middleName"
								className="ml-4"
								value={middleName}
								onChange={(e) => setMiddleName(e.target.value)}
							></input>
						</label>
					</div>
					<div className="w-[40vw] flex flex-col gap-5">
						<label htmlFor="askName">
							Ask Price:
							<span className="ml-4 font-semibold">Php</span>
							<input
								type="text"
								id="askPrice"
								className="ml-2"
								value={askPriceShow}
								onChange={(e) => convertPrice(e.target.value)}
							></input>
						</label>
						<span>
							Item List:
							<button
								className="ml-6 font-semibold text-gray-100 bg-green-300"
								type="button"
							>
								Add Item
							</button>
						</span>
						<div className="w-full bg-green-100 h-[50vh] border-gray-500 border-solid border-2 p-2">
							<p>ASHKDLAKj</p>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}

export default NewCustomer;
