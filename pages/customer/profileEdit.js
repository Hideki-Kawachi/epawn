import React, { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../utilities/config";
import { useRouter } from "next/router";
import Image from "next/image";
import NavigationFooter from "../../components/customer/navigationFooter";
import Link from "next/link";
import CustomerHeader from "../../components/customer/header";
import dbConnect from "../../utilities/dbConnect";
import User from "../../schemas/user";
import CustomerInfo from "../../schemas/customerInfo";
import dayjs from "dayjs";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "customer") {
			await dbConnect();
			let userInfo = await User.findOne({
				userID: req.session.userData.userID,
			});
			let customerInfo = await CustomerInfo.findOne({
				userID: userInfo.userID,
			});
			return {
				props: {
					currentUser: req.session.userData,
					userData: JSON.parse(JSON.stringify(userInfo)),
					customerData: JSON.parse(JSON.stringify(customerInfo)),
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

function ProfileEdit({ currentUser, userData, customerData }) {
	const [isEditing, setIsEditing] = useState(false);
	const [changePass, setChangePass] = useState(false);
	const [contactNumber, setContactNumber] = useState(
		customerData.contactNumber
	);
	const [presentAddress, setPresentAddress] = useState(
		customerData.presentAddress
	);
	const [password, setPassword] = useState("");
	const [confirmPass, setConfirmPass] = useState("");
	const originalContact = customerData.contactNumber;
	const originalAddress = customerData.presentAddress;
	const router = useRouter();

	function cancel() {
		setChangePass(false);
		setIsEditing(false);
		setContactNumber(originalContact);
		setPresentAddress(originalAddress);
		setPassword("");
		setConfirmPass("");
	}

	function isDisabledEdit() {
		if (isEditing) {
			return (
				(originalContact == contactNumber &&
					originalAddress == presentAddress) ||
				contactNumber.length != 11 ||
				presentAddress.length < 10
			);
		}
		return true;
	}

	function isDisabledPass() {
		if (changePass) {
			return password != confirmPass || password.length <= 8;
		}
		return true;
	}

	function submitForm() {
		if (isEditing) {
			fetch("/api/users/customers/editProfile", {
				method: "POST",
				body: JSON.stringify({
					contactNum: contactNumber,
					presentAdd: presentAddress,
					userID: customerData.userID,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log("DATA IS:", data);
					router.reload();
				});
		} else if (changePass) {
			fetch("/api/users/editPassword", {
				method: "POST",
				body: JSON.stringify({
					password: password,
					userID: customerData.userID,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log("DATA IS:", data);
					router.reload();
				});
		}
	}

	return (
		<div className="flex flex-col items-center">
			<div className="fixed flex flex-col items-center w-full h-full border-2 md:w-1/4">
				<CustomerHeader></CustomerHeader>
				<div className="w-full h-full mb-10 overflow-y-auto bg-green-50">
					<h1 className="mt-4 text-base font-bold text-center font-nunito">
						User Profile
					</h1>
					<div className="flex flex-col items-center w-full h-full mb-10 text-sm font-nunito">
						<svg
							className="h-24 mb-2 bg-gray-400 border-2 border-gray-400 rounded-full w-min aspect-square"
							viewBox="0 0 60 60"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M12 47.4447C12 45.8952 13.158 44.5857 14.7 44.4147C26.2725 43.1337 33.78 43.2492 45.327 44.4432C45.9036 44.5037 46.4501 44.7309 46.8998 45.0969C47.3494 45.4629 47.6827 45.952 47.859 46.5043C48.0352 47.0567 48.0468 47.6484 47.8923 48.2072C47.7378 48.7661 47.424 49.2678 46.989 49.6512C33.3615 61.5297 25.5735 61.3662 12.96 49.6632C12.345 49.0932 12 48.2832 12 47.4462V47.4447Z"
								fill="white"
							/>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M45.1725 45.9349C33.717 44.7499 26.3175 44.6389 14.8635 45.9064C14.4865 45.9503 14.1389 46.1318 13.8873 46.416C13.6357 46.7003 13.4978 47.0673 13.5 47.4469C13.5 47.8759 13.6785 48.2824 13.98 48.5644C20.232 54.3634 24.969 56.9839 29.5995 57.0004C34.2465 57.0169 39.2385 54.4174 46.0035 48.5224C46.2184 48.3311 46.3731 48.0815 46.4489 47.8039C46.5246 47.5264 46.518 47.2328 46.43 46.9588C46.342 46.6849 46.1763 46.4425 45.953 46.261C45.7298 46.0794 45.4586 45.9667 45.1725 45.9364V45.9349ZM14.535 42.9244C26.229 41.6299 33.846 41.7469 45.483 42.9514C46.3505 43.0419 47.1727 43.3834 47.849 43.9341C48.5254 44.4847 49.0265 45.2207 49.2911 46.0517C49.5556 46.8828 49.5721 47.773 49.3386 48.6133C49.105 49.4536 48.6315 50.2076 47.976 50.7829C41.1135 56.7649 35.3985 60.0229 29.5905 60.0004C23.766 59.9794 18.303 56.6659 11.9415 50.7634C11.486 50.3392 11.1229 49.8255 10.8749 49.2547C10.6269 48.6838 10.4993 48.0678 10.5 47.4454C10.4978 46.327 10.9083 45.2472 11.6529 44.4127C12.3974 43.5782 13.4236 43.0477 14.535 42.9229V42.9244Z"
								fill="white"
							/>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M30 57C44.9115 57 57 44.9115 57 30C57 15.0885 44.9115 3 30 3C15.0885 3 3 15.0885 3 30C3 44.9115 15.0885 57 30 57ZM30 60C46.569 60 60 46.569 60 30C60 13.431 46.569 0 30 0C13.431 0 0 13.431 0 30C0 46.569 13.431 60 30 60Z"
								fill="white"
							/>
							<path
								d="M42 24C42 27.1826 40.7357 30.2348 38.4853 32.4853C36.2348 34.7357 33.1826 36 30 36C26.8174 36 23.7652 34.7357 21.5147 32.4853C19.2643 30.2348 18 27.1826 18 24C18 20.8174 19.2643 17.7652 21.5147 15.5147C23.7652 13.2643 26.8174 12 30 12C33.1826 12 36.2348 13.2643 38.4853 15.5147C40.7357 17.7652 42 20.8174 42 24Z"
								fill="white"
							/>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M30 33C32.3869 33 34.6761 32.0518 36.364 30.364C38.0518 28.6761 39 26.3869 39 24C39 21.6131 38.0518 19.3239 36.364 17.636C34.6761 15.9482 32.3869 15 30 15C27.6131 15 25.3239 15.9482 23.636 17.636C21.9482 19.3239 21 21.6131 21 24C21 26.3869 21.9482 28.6761 23.636 30.364C25.3239 32.0518 27.6131 33 30 33ZM30 36C33.1826 36 36.2348 34.7357 38.4853 32.4853C40.7357 30.2348 42 27.1826 42 24C42 20.8174 40.7357 17.7652 38.4853 15.5147C36.2348 13.2643 33.1826 12 30 12C26.8174 12 23.7652 13.2643 21.5147 15.5147C19.2643 17.7652 18 20.8174 18 24C18 27.1826 19.2643 30.2348 21.5147 32.4853C23.7652 34.7357 26.8174 36 30 36Z"
								fill="white"
							/>
						</svg>
						<span className="text-base font-semibold">
							{currentUser.firstName} {currentUser.middleName}{" "}
							{currentUser.lastName}
						</span>
						<span>User ID: {customerData.userID}</span>
						<div className="flex flex-col w-full p-4 text-start">
							{changePass ? (
								<>
									<span className="mt-2 font-semibold">New Password:</span>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									></input>
									<span className="mt-2 font-semibold">
										Confirm New Password:
									</span>
									<input
										type="password"
										value={confirmPass}
										onChange={(e) => setConfirmPass(e.target.value)}
									></input>
									<i className="text-[1rem] mt-2">
										Password must be more than 8 characters.
									</i>
								</>
							) : (
								<>
									<span className="mt-2 font-semibold">Birth Date:</span>
									<span>
										{dayjs(customerData.birthDate).format("MMM DD, YYYY")}
									</span>
									<span className="mt-2 font-semibold">Birth Place:</span>
									<span>{customerData.birthPlace}</span>
									<span className="mt-2 font-semibold">Contact Number:</span>
									<input
										value={contactNumber}
										disabled={!isEditing}
										type="tel"
										onChange={(e) => setContactNumber(e.target.value)}
									></input>
									<span className="mt-2 font-semibold">Present Address:</span>
									<input
										value={presentAddress}
										disabled={!isEditing}
										type="text"
										onChange={(e) => setPresentAddress(e.target.value)}
									></input>
								</>
							)}
						</div>
						<div className="flex flex-col items-center gap-3 mt-2">
							{isEditing || changePass ? (
								<>
									<button
										className="bg-green-300"
										disabled={isDisabledEdit() && isDisabledPass()}
										onClick={() => submitForm()}
									>
										Save Changes
									</button>
									<button className="bg-red-300" onClick={() => cancel()}>
										Cancel
									</button>
								</>
							) : (
								<>
									{" "}
									<button
										className="bg-blue-300"
										onClick={() => setIsEditing(true)}
									>
										Edit Profile
									</button>
									<button
										className="bg-red-300"
										onClick={() => setChangePass(true)}
									>
										Change Password
									</button>
								</>
							)}
						</div>
					</div>
				</div>
				<NavigationFooter currentUser={currentUser}></NavigationFooter>
			</div>
		</div>
	);
}

export default ProfileEdit;
