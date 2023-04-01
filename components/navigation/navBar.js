import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PawnNav from "./pawnNav";

function NavBar({ currentUser }) {
	const [url, setURL] = useState("none");
	const [pawnHover, setPawnHover] = useState(false);

	useEffect(() => {
		//console.log(window.location.pathname);
		let path = window.location.pathname;
		setURL(path.split("/", 2)[1]);
	}, []);

	useEffect(() => {
		//console.log("url is:", url);
		let buttons = document.getElementsByClassName("nav-button-selected");
		for (const element of buttons) {
			element.classList.replace("nav-button-selected", "nav-button");
		}

		if (url == "") {
			document.getElementById("nav-home")?.classList.add("-selected");
		} else {
			document.getElementById("nav-" + url)?.classList.add("-selected");
		}
	}, [url]);

	return (
		<>
			<nav className="fixed z-40 h-full bg-blue-500 w-[9rem] pb-[20vh] overflow-x-visible overflow-y-scroll">
				<div>
					<div className="relative mx-2 aspect-[30/18] mt-5 mb-5">
						<Image src={"/logo_transparent.png"} layout="fill"></Image>
					</div>
				</div>

				{currentUser.role == "admin" ? (
					<>
						<Link href={"/cashflow"}>
							<a id="nav-branch" className="nav-button">
								<svg
									width="50"
									height="50"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M8 19V5H11.5C12.0909 5 12.6761 5.1164 13.2221 5.34254C13.768 5.56869 14.2641 5.90016 14.682 6.31802C15.0998 6.73588 15.4313 7.23196 15.6575 7.77792C15.8836 8.32389 16 8.90905 16 9.5C16 10.0909 15.8836 10.6761 15.6575 11.2221C15.4313 11.768 15.0998 12.2641 14.682 12.682C14.2641 13.0998 13.768 13.4313 13.2221 13.6575C12.6761 13.8836 12.0909 14 11.5 14H8M18 8H6M18 11H6"
										stroke="#14C6A5"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>

								<h1>Cash Flow</h1>
							</a>
						</Link>
						<Link href={"/logs"}>
							<a id="nav-branch" className="nav-button">
								<svg
									width="50"
									height="50"
									viewBox="0 0 24 24"
									fill="#14C6A5"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M5 21C4.45 21 3.979 20.804 3.587 20.412C3.195 20.02 2.99934 19.5493 3 19V5C3 4.45 3.196 3.979 3.588 3.587C3.98 3.195 4.45067 2.99934 5 3H19C19.55 3 20.021 3.196 20.413 3.588C20.805 3.98 21.0007 4.45067 21 5V19C21 19.55 20.804 20.021 20.412 20.413C20.02 20.805 19.5493 21.0007 19 21H5ZM5 19H19V5H5V19ZM8 17C8.28334 17 8.521 16.904 8.713 16.712C8.905 16.52 9.00067 16.2827 9 16C9 15.7167 8.904 15.479 8.712 15.287C8.52 15.095 8.28267 14.9993 8 15C7.71667 15 7.479 15.096 7.287 15.288C7.095 15.48 6.99934 15.7173 7 16C7 16.2833 7.096 16.521 7.288 16.713C7.48 16.905 7.71734 17.0007 8 17ZM8 13C8.28334 13 8.521 12.904 8.713 12.712C8.905 12.52 9.00067 12.2827 9 12C9 11.7167 8.904 11.479 8.712 11.287C8.52 11.095 8.28267 10.9993 8 11C7.71667 11 7.479 11.096 7.287 11.288C7.095 11.48 6.99934 11.7173 7 12C7 12.2833 7.096 12.521 7.288 12.713C7.48 12.905 7.71734 13.0007 8 13ZM8 9C8.28334 9 8.521 8.904 8.713 8.712C8.905 8.52 9.00067 8.28267 9 8C9 7.71667 8.904 7.479 8.712 7.287C8.52 7.095 8.28267 6.99934 8 7C7.71667 7 7.479 7.096 7.287 7.288C7.095 7.48 6.99934 7.71734 7 8C7 8.28334 7.096 8.521 7.288 8.713C7.48 8.905 7.71734 9.00067 8 9ZM12 17H16C16.2833 17 16.521 16.904 16.713 16.712C16.905 16.52 17.0007 16.2827 17 16C17 15.7167 16.904 15.479 16.712 15.287C16.52 15.095 16.2827 14.9993 16 15H12C11.7167 15 11.479 15.096 11.287 15.288C11.095 15.48 10.9993 15.7173 11 16C11 16.2833 11.096 16.521 11.288 16.713C11.48 16.905 11.7173 17.0007 12 17ZM12 13H16C16.2833 13 16.521 12.904 16.713 12.712C16.905 12.52 17.0007 12.2827 17 12C17 11.7167 16.904 11.479 16.712 11.287C16.52 11.095 16.2827 10.9993 16 11H12C11.7167 11 11.479 11.096 11.287 11.288C11.095 11.48 10.9993 11.7173 11 12C11 12.2833 11.096 12.521 11.288 12.713C11.48 12.905 11.7173 13.0007 12 13ZM12 9H16C16.2833 9 16.521 8.904 16.713 8.712C16.905 8.52 17.0007 8.28267 17 8C17 7.71667 16.904 7.479 16.712 7.287C16.52 7.095 16.2827 6.99934 16 7H12C11.7167 7 11.479 7.096 11.287 7.288C11.095 7.48 10.9993 7.71734 11 8C11 8.28334 11.096 8.521 11.288 8.713C11.48 8.905 11.7173 9.00067 12 9Z"
										fill="#14C6A5"
									/>
								</svg>

								<h1>Logs</h1>
							</a>
						</Link>
						<Link href={"/search"}>
							<a id="nav-search" className="nav-button">
								<svg
									width="50"
									height="50"
									viewBox="0 0 50 50"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M32.2917 29.1667H30.6458L30.0625 28.6042C32.1747 26.1542 33.3356 23.0265 33.3333 19.7917C33.3333 17.1134 32.5391 14.4952 31.0512 12.2683C29.5632 10.0414 27.4483 8.30574 24.9738 7.2808C22.4994 6.25587 19.7766 5.9877 17.1498 6.51021C14.523 7.03271 12.1101 8.32243 10.2163 10.2163C8.32243 12.1101 7.03271 14.523 6.51021 17.1498C5.9877 19.7766 6.25587 22.4994 7.2808 24.9738C8.30574 27.4483 10.0414 29.5632 12.2683 31.0512C14.4952 32.5391 17.1134 33.3333 19.7917 33.3333C23.1458 33.3333 26.2292 32.1042 28.6042 30.0625L29.1667 30.6458V32.2917L39.5833 42.6875L42.6875 39.5833L32.2917 29.1667ZM19.7917 29.1667C14.6042 29.1667 10.4167 24.9792 10.4167 19.7917C10.4167 14.6042 14.6042 10.4167 19.7917 10.4167C24.9792 10.4167 29.1667 14.6042 29.1667 19.7917C29.1667 24.9792 24.9792 29.1667 19.7917 29.1667Z"
										fill="#19947D"
									/>
								</svg>

								<h1>Search</h1>
							</a>
						</Link>

						<Link href={"/users"}>
							<a id="nav-users" className="nav-button">
								<svg
									width="50"
									height="50"
									viewBox="0 0 70 70"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M36 3L9 15V33C9 49.65 20.52 65.22 36 69C51.48 65.22 63 49.65 63 33V15L36 3ZM36 14.7C37.78 14.7 39.5201 15.2278 41.0001 16.2168C42.4802 17.2057 43.6337 18.6113 44.3149 20.2558C44.9961 21.9004 45.1743 23.71 44.8271 25.4558C44.4798 27.2016 43.6226 28.8053 42.364 30.064C41.1053 31.3226 39.5016 32.1798 37.7558 32.5271C36.01 32.8743 34.2004 32.6961 32.5558 32.0149C30.9113 31.3337 29.5057 30.1802 28.5168 28.7001C27.5278 27.2201 27 25.48 27 23.7C27 21.3131 27.9482 19.0239 29.636 17.336C31.3239 15.6482 33.6131 14.7 36 14.7ZM36 38.4C42 38.4 54 41.67 54 47.64C52.0297 50.6104 49.3549 53.047 46.2142 54.7325C43.0735 56.418 39.5644 57.3001 36 57.3001C32.4356 57.3002 28.9265 56.418 25.7858 54.7325C22.6451 53.047 19.9703 50.6104 18 47.64C18 41.67 30 38.4 36 38.4Z"
										fill="#14C6A5"
									/>
								</svg>

								<h1>Users</h1>
							</a>
						</Link>
					</>
				) : (
					<>
						<Link href={"/"}>
							<a id="nav-home" className="nav-button">
								<svg
									width="50"
									height="50"
									viewBox="0 0 50 50"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12.4987 39.5833H18.7487V27.0833H31.2487V39.5833H37.4987V20.8333L24.9987 11.4583L12.4987 20.8333V39.5833ZM8.33203 43.75V18.75L24.9987 6.25L41.6654 18.75V43.75H27.082V31.25H22.9154V43.75H8.33203Z"
										fill="#14C6A5"
									/>
								</svg>
								<h1>Home</h1>
							</a>
						</Link>
						<div
							id="nav-pawn"
							className="nav-button"
							onMouseEnter={() => setPawnHover(true)}
							onMouseLeave={() => setPawnHover(false)}
						>
							<svg
								width="35"
								height="35"
								viewBox="0 0 35 35"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M8.7513 4.375H26.2513L32.0846 13.125L17.5013 32.0833L2.91797 13.125L8.7513 4.375Z"
									stroke="#14C6A5"
									strokeWidth="3"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M18.9596 4.375L23.3346 13.125L17.5013 32.0833L11.668 13.125L16.043 4.375M2.91797 13.125H32.0846"
									stroke="#14C6A5"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<h1>Pawn</h1>
							{pawnHover ? <PawnNav role={currentUser.role}></PawnNav> : <></>}
						</div>
						{currentUser.role == "clerk" ? (
							<Link href={"/redeem/clerk"}>
								<a id="nav-redeem" className="nav-button">
									<svg
										width="53"
										height="50"
										viewBox="0 0 53 50"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M44.1654 27.084C45.4904 27.084 46.5945 27.5007 47.4779 28.334C48.1404 29.1673 48.582 30.209 48.582 31.2507L30.9154 37.5007L15.457 33.334V14.584H19.6529L35.7737 20.209C36.8779 20.6257 37.5404 21.459 37.5404 22.5007C37.5404 23.1257 37.3195 23.7507 36.8779 24.1673C36.4362 24.584 35.5529 25.0007 34.8904 25.0007H28.707L24.732 23.5423L24.0695 25.4173L28.707 27.084H44.1654ZM2.20703 14.584H11.0404V37.5007H2.20703V14.584Z"
											fill="#14C6A5"
										/>
										<g clipPath="url(#clip0_48_866)">
											<path
												d="M38.1626 10H46.6426L49.4693 14L42.4026 22.6667L35.3359 14L38.1626 10Z"
												stroke="#14C6A5"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M43.1093 10L45.2293 14L42.4026 22.6667L39.5759 14L41.6959 10M35.3359 14H49.4693"
												stroke="#14C6A5"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</g>
										<defs>
											<clipPath id="clip0_48_866">
												<rect
													width="16.96"
													height="16"
													fill="white"
													transform="translate(33.9219 8)"
												/>
											</clipPath>
										</defs>
									</svg>

									<h1>Redeem</h1>
								</a>
							</Link>
						) : (
							<Link href={"/redeem/manager"}>
								<a id="nav-redeem" className="nav-button">
									<svg
										width="53"
										height="50"
										viewBox="0 0 53 50"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M44.1654 27.084C45.4904 27.084 46.5945 27.5007 47.4779 28.334C48.1404 29.1673 48.582 30.209 48.582 31.2507L30.9154 37.5007L15.457 33.334V14.584H19.6529L35.7737 20.209C36.8779 20.6257 37.5404 21.459 37.5404 22.5007C37.5404 23.1257 37.3195 23.7507 36.8779 24.1673C36.4362 24.584 35.5529 25.0007 34.8904 25.0007H28.707L24.732 23.5423L24.0695 25.4173L28.707 27.084H44.1654ZM2.20703 14.584H11.0404V37.5007H2.20703V14.584Z"
											fill="#14C6A5"
										/>
										<g clipPath="url(#clip0_48_866)">
											<path
												d="M38.1626 10H46.6426L49.4693 14L42.4026 22.6667L35.3359 14L38.1626 10Z"
												stroke="#14C6A5"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M43.1093 10L45.2293 14L42.4026 22.6667L39.5759 14L41.6959 10M35.3359 14H49.4693"
												stroke="#14C6A5"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</g>
										<defs>
											<clipPath id="clip0_48_866">
												<rect
													width="16.96"
													height="16"
													fill="white"
													transform="translate(33.9219 8)"
												/>
											</clipPath>
										</defs>
									</svg>

									<h1>Redeem</h1>
								</a>
							</Link>
						)}
						{currentUser.role == "clerk" ? (
							<Link href={"/renew/clerk"}>
								<a id="nav-renew" className="nav-button">
									<svg
										width="50"
										height="50"
										viewBox="0 0 50 50"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M9.32161 30.625C8.97439 29.7222 8.723 28.8104 8.56745 27.8896C8.4105 26.9701 8.33203 26.0417 8.33203 25.1042C8.33203 20.4514 9.94661 16.4931 13.1758 13.2292C16.4049 9.96528 20.3459 8.33333 24.9987 8.33333H25.3633L23.4883 6.45833C23.1063 6.07639 22.9154 5.59028 22.9154 5C22.9154 4.40972 23.1063 3.92361 23.4883 3.54167C23.8702 3.15972 24.3563 2.96875 24.9466 2.96875C25.5369 2.96875 26.023 3.15972 26.4049 3.54167L31.8216 8.95833C32.0299 9.16667 32.1779 9.39236 32.2654 9.63542C32.3515 9.87847 32.3945 10.1389 32.3945 10.4167C32.3945 10.6944 32.3515 10.9549 32.2654 11.1979C32.1779 11.441 32.0299 11.6667 31.8216 11.875L26.4049 17.2917C26.023 17.6736 25.5369 17.8646 24.9466 17.8646C24.3563 17.8646 23.8702 17.6736 23.4883 17.2917C23.1063 16.9097 22.9154 16.4236 22.9154 15.8333C22.9154 15.2431 23.1063 14.7569 23.4883 14.375L25.3633 12.5H24.9987C21.5265 12.5 18.5751 13.7236 16.1445 16.1708C13.714 18.6194 12.4987 21.5972 12.4987 25.1042C12.4987 25.7986 12.5598 26.4757 12.682 27.1354C12.8029 27.7951 12.9848 28.4549 13.2279 29.1146C13.3668 29.4618 13.4015 29.8347 13.332 30.2333C13.2626 30.6333 13.089 30.9722 12.8112 31.25C12.1862 31.875 11.5181 32.1271 10.807 32.0062C10.0945 31.884 9.59939 31.4236 9.32161 30.625ZM23.5924 46.4583L18.1758 41.0417C17.9674 40.8333 17.8202 40.6076 17.7341 40.3646C17.6466 40.1215 17.6029 39.8611 17.6029 39.5833C17.6029 39.3056 17.6466 39.0451 17.7341 38.8021C17.8202 38.559 17.9674 38.3333 18.1758 38.125L23.5924 32.7083C23.9744 32.3264 24.4605 32.1354 25.0508 32.1354C25.6411 32.1354 26.1272 32.3264 26.5091 32.7083C26.8911 33.0903 27.082 33.5764 27.082 34.1667C27.082 34.7569 26.8911 35.2431 26.5091 35.625L24.6341 37.5H24.9987C28.4709 37.5 31.4223 36.2764 33.8529 33.8292C36.2834 31.3806 37.4987 28.4028 37.4987 24.8958C37.4987 24.2014 37.4383 23.5243 37.3174 22.8646C37.1952 22.2049 37.0126 21.5451 36.7695 20.8854C36.6306 20.5382 36.5959 20.1646 36.6654 19.7646C36.7348 19.366 36.9084 19.0278 37.1862 18.75C37.8112 18.125 38.4793 17.8729 39.1904 17.9937C39.9029 18.116 40.398 18.5764 40.6758 19.375C41.023 20.2778 41.2751 21.1889 41.432 22.1083C41.5876 23.0292 41.6654 23.9583 41.6654 24.8958C41.6654 29.5486 40.0508 33.5069 36.8216 36.7708C33.5924 40.0347 29.6515 41.6667 24.9987 41.6667H24.6341L26.5091 43.5417C26.8911 43.9236 27.082 44.4097 27.082 45C27.082 45.5903 26.8911 46.0764 26.5091 46.4583C26.1272 46.8403 25.6411 47.0312 25.0508 47.0312C24.4605 47.0312 23.9744 46.8403 23.5924 46.4583Z"
											fill="#14C6A5"
										/>
									</svg>
									<h1>Renew</h1>
								</a>
							</Link>
						) : (
							<Link href={"/renew/manager"}>
								<a id="nav-renew" className="nav-button">
									<svg
										width="50"
										height="50"
										viewBox="0 0 50 50"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M9.32161 30.625C8.97439 29.7222 8.723 28.8104 8.56745 27.8896C8.4105 26.9701 8.33203 26.0417 8.33203 25.1042C8.33203 20.4514 9.94661 16.4931 13.1758 13.2292C16.4049 9.96528 20.3459 8.33333 24.9987 8.33333H25.3633L23.4883 6.45833C23.1063 6.07639 22.9154 5.59028 22.9154 5C22.9154 4.40972 23.1063 3.92361 23.4883 3.54167C23.8702 3.15972 24.3563 2.96875 24.9466 2.96875C25.5369 2.96875 26.023 3.15972 26.4049 3.54167L31.8216 8.95833C32.0299 9.16667 32.1779 9.39236 32.2654 9.63542C32.3515 9.87847 32.3945 10.1389 32.3945 10.4167C32.3945 10.6944 32.3515 10.9549 32.2654 11.1979C32.1779 11.441 32.0299 11.6667 31.8216 11.875L26.4049 17.2917C26.023 17.6736 25.5369 17.8646 24.9466 17.8646C24.3563 17.8646 23.8702 17.6736 23.4883 17.2917C23.1063 16.9097 22.9154 16.4236 22.9154 15.8333C22.9154 15.2431 23.1063 14.7569 23.4883 14.375L25.3633 12.5H24.9987C21.5265 12.5 18.5751 13.7236 16.1445 16.1708C13.714 18.6194 12.4987 21.5972 12.4987 25.1042C12.4987 25.7986 12.5598 26.4757 12.682 27.1354C12.8029 27.7951 12.9848 28.4549 13.2279 29.1146C13.3668 29.4618 13.4015 29.8347 13.332 30.2333C13.2626 30.6333 13.089 30.9722 12.8112 31.25C12.1862 31.875 11.5181 32.1271 10.807 32.0062C10.0945 31.884 9.59939 31.4236 9.32161 30.625ZM23.5924 46.4583L18.1758 41.0417C17.9674 40.8333 17.8202 40.6076 17.7341 40.3646C17.6466 40.1215 17.6029 39.8611 17.6029 39.5833C17.6029 39.3056 17.6466 39.0451 17.7341 38.8021C17.8202 38.559 17.9674 38.3333 18.1758 38.125L23.5924 32.7083C23.9744 32.3264 24.4605 32.1354 25.0508 32.1354C25.6411 32.1354 26.1272 32.3264 26.5091 32.7083C26.8911 33.0903 27.082 33.5764 27.082 34.1667C27.082 34.7569 26.8911 35.2431 26.5091 35.625L24.6341 37.5H24.9987C28.4709 37.5 31.4223 36.2764 33.8529 33.8292C36.2834 31.3806 37.4987 28.4028 37.4987 24.8958C37.4987 24.2014 37.4383 23.5243 37.3174 22.8646C37.1952 22.2049 37.0126 21.5451 36.7695 20.8854C36.6306 20.5382 36.5959 20.1646 36.6654 19.7646C36.7348 19.366 36.9084 19.0278 37.1862 18.75C37.8112 18.125 38.4793 17.8729 39.1904 17.9937C39.9029 18.116 40.398 18.5764 40.6758 19.375C41.023 20.2778 41.2751 21.1889 41.432 22.1083C41.5876 23.0292 41.6654 23.9583 41.6654 24.8958C41.6654 29.5486 40.0508 33.5069 36.8216 36.7708C33.5924 40.0347 29.6515 41.6667 24.9987 41.6667H24.6341L26.5091 43.5417C26.8911 43.9236 27.082 44.4097 27.082 45C27.082 45.5903 26.8911 46.0764 26.5091 46.4583C26.1272 46.8403 25.6411 47.0312 25.0508 47.0312C24.4605 47.0312 23.9744 46.8403 23.5924 46.4583Z"
											fill="#14C6A5"
										/>
									</svg>
									<h1>Renew</h1>
								</a>
							</Link>
						)}
						<Link href={"/search"}>
							<a id="nav-search" className="nav-button">
								<svg
									width="50"
									height="50"
									viewBox="0 0 50 50"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M32.2917 29.1667H30.6458L30.0625 28.6042C32.1747 26.1542 33.3356 23.0265 33.3333 19.7917C33.3333 17.1134 32.5391 14.4952 31.0512 12.2683C29.5632 10.0414 27.4483 8.30574 24.9738 7.2808C22.4994 6.25587 19.7766 5.9877 17.1498 6.51021C14.523 7.03271 12.1101 8.32243 10.2163 10.2163C8.32243 12.1101 7.03271 14.523 6.51021 17.1498C5.9877 19.7766 6.25587 22.4994 7.2808 24.9738C8.30574 27.4483 10.0414 29.5632 12.2683 31.0512C14.4952 32.5391 17.1134 33.3333 19.7917 33.3333C23.1458 33.3333 26.2292 32.1042 28.6042 30.0625L29.1667 30.6458V32.2917L39.5833 42.6875L42.6875 39.5833L32.2917 29.1667ZM19.7917 29.1667C14.6042 29.1667 10.4167 24.9792 10.4167 19.7917C10.4167 14.6042 14.6042 10.4167 19.7917 10.4167C24.9792 10.4167 29.1667 14.6042 29.1667 19.7917C29.1667 24.9792 24.9792 29.1667 19.7917 29.1667Z"
										fill="#14C6A5"
									/>
								</svg>

								<h1>Search</h1>
							</a>
						</Link>
						{currentUser.role == "manager" || currentUser.role == "admin" ? (
							<>
								<Link href={"/reports"}>
									<a id="nav-reports" className="nav-button">
										<svg
											width="50"
											height="50"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M13.5 6V11.5H5.5V1.5H9V4.25C9 5.216 9.784 6 10.75 6H13.5ZM10.5 1.621L13.379 4.5H10.75C10.6837 4.5 10.6201 4.47366 10.5732 4.42678C10.5263 4.37989 10.5 4.3163 10.5 4.25V1.621ZM5 0C4.73478 0 4.48043 0.105357 4.29289 0.292893C4.10536 0.48043 4 0.734784 4 1V3H2.25C1.56 3 1 3.56 1 4.25V14.75C1 15.44 1.56 16 2.25 16H10.5C11.19 16 11.75 15.44 11.75 14.75V13.08C11.7501 13.0533 11.7487 13.0266 11.746 13H14C14.2652 13 14.5196 12.8946 14.7071 12.7071C14.8946 12.5196 15 12.2652 15 12V4.414C14.9999 4.14881 14.8945 3.89449 14.707 3.707L11.293 0.293C11.1055 0.105451 10.8512 5.66374e-05 10.586 0H5ZM4 12V4.5H2.5V14.5H10.25V13.08C10.25 13.053 10.251 13.026 10.254 13H5C4.73478 13 4.48043 12.8946 4.29289 12.7071C4.10536 12.5196 4 12.2652 4 12Z"
												fill="#14C6A5"
											/>
										</svg>

										<h1>Reports</h1>
									</a>
								</Link>
								<Link href={"/cashflow"}>
									<a id="nav-cashflow" className="nav-button">
										<svg
											width="50"
											height="50"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M8 19V5H11.5C12.0909 5 12.6761 5.1164 13.2221 5.34254C13.768 5.56869 14.2641 5.90016 14.682 6.31802C15.0998 6.73588 15.4313 7.23196 15.6575 7.77792C15.8836 8.32389 16 8.90905 16 9.5C16 10.0909 15.8836 10.6761 15.6575 11.2221C15.4313 11.768 15.0998 12.2641 14.682 12.682C14.2641 13.0998 13.768 13.4313 13.2221 13.6575C12.6761 13.8836 12.0909 14 11.5 14H8M18 8H6M18 11H6"
												stroke="#14C6A5"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>

										<h1>Cash Flow</h1>
									</a>
								</Link>
								<Link href={"/logs"}>
									<a id="nav-logs" className="nav-button">
										<svg
											width="50"
											height="50"
											viewBox="0 0 24 24"
											fill="#14C6A5"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M5 21C4.45 21 3.979 20.804 3.587 20.412C3.195 20.02 2.99934 19.5493 3 19V5C3 4.45 3.196 3.979 3.588 3.587C3.98 3.195 4.45067 2.99934 5 3H19C19.55 3 20.021 3.196 20.413 3.588C20.805 3.98 21.0007 4.45067 21 5V19C21 19.55 20.804 20.021 20.412 20.413C20.02 20.805 19.5493 21.0007 19 21H5ZM5 19H19V5H5V19ZM8 17C8.28334 17 8.521 16.904 8.713 16.712C8.905 16.52 9.00067 16.2827 9 16C9 15.7167 8.904 15.479 8.712 15.287C8.52 15.095 8.28267 14.9993 8 15C7.71667 15 7.479 15.096 7.287 15.288C7.095 15.48 6.99934 15.7173 7 16C7 16.2833 7.096 16.521 7.288 16.713C7.48 16.905 7.71734 17.0007 8 17ZM8 13C8.28334 13 8.521 12.904 8.713 12.712C8.905 12.52 9.00067 12.2827 9 12C9 11.7167 8.904 11.479 8.712 11.287C8.52 11.095 8.28267 10.9993 8 11C7.71667 11 7.479 11.096 7.287 11.288C7.095 11.48 6.99934 11.7173 7 12C7 12.2833 7.096 12.521 7.288 12.713C7.48 12.905 7.71734 13.0007 8 13ZM8 9C8.28334 9 8.521 8.904 8.713 8.712C8.905 8.52 9.00067 8.28267 9 8C9 7.71667 8.904 7.479 8.712 7.287C8.52 7.095 8.28267 6.99934 8 7C7.71667 7 7.479 7.096 7.287 7.288C7.095 7.48 6.99934 7.71734 7 8C7 8.28334 7.096 8.521 7.288 8.713C7.48 8.905 7.71734 9.00067 8 9ZM12 17H16C16.2833 17 16.521 16.904 16.713 16.712C16.905 16.52 17.0007 16.2827 17 16C17 15.7167 16.904 15.479 16.712 15.287C16.52 15.095 16.2827 14.9993 16 15H12C11.7167 15 11.479 15.096 11.287 15.288C11.095 15.48 10.9993 15.7173 11 16C11 16.2833 11.096 16.521 11.288 16.713C11.48 16.905 11.7173 17.0007 12 17ZM12 13H16C16.2833 13 16.521 12.904 16.713 12.712C16.905 12.52 17.0007 12.2827 17 12C17 11.7167 16.904 11.479 16.712 11.287C16.52 11.095 16.2827 10.9993 16 11H12C11.7167 11 11.479 11.096 11.287 11.288C11.095 11.48 10.9993 11.7173 11 12C11 12.2833 11.096 12.521 11.288 12.713C11.48 12.905 11.7173 13.0007 12 13ZM12 9H16C16.2833 9 16.521 8.904 16.713 8.712C16.905 8.52 17.0007 8.28267 17 8C17 7.71667 16.904 7.479 16.712 7.287C16.52 7.095 16.2827 6.99934 16 7H12C11.7167 7 11.479 7.096 11.287 7.288C11.095 7.48 10.9993 7.71734 11 8C11 8.28334 11.096 8.521 11.288 8.713C11.48 8.905 11.7173 9.00067 12 9Z"
												fill="#14C6A5"
											/>
										</svg>

										<h1>Logs</h1>
									</a>
								</Link>
								<Link href={"/users"}>
									<a id="nav-users" className="nav-button">
										<svg
											width="50"
											height="50"
											viewBox="0 0 70 70"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M36 3L9 15V33C9 49.65 20.52 65.22 36 69C51.48 65.22 63 49.65 63 33V15L36 3ZM36 14.7C37.78 14.7 39.5201 15.2278 41.0001 16.2168C42.4802 17.2057 43.6337 18.6113 44.3149 20.2558C44.9961 21.9004 45.1743 23.71 44.8271 25.4558C44.4798 27.2016 43.6226 28.8053 42.364 30.064C41.1053 31.3226 39.5016 32.1798 37.7558 32.5271C36.01 32.8743 34.2004 32.6961 32.5558 32.0149C30.9113 31.3337 29.5057 30.1802 28.5168 28.7001C27.5278 27.2201 27 25.48 27 23.7C27 21.3131 27.9482 19.0239 29.636 17.336C31.3239 15.6482 33.6131 14.7 36 14.7ZM36 38.4C42 38.4 54 41.67 54 47.64C52.0297 50.6104 49.3549 53.047 46.2142 54.7325C43.0735 56.418 39.5644 57.3001 36 57.3001C32.4356 57.3002 28.9265 56.418 25.7858 54.7325C22.6451 53.047 19.9703 50.6104 18 47.64C18 41.67 30 38.4 36 38.4Z"
												fill="#14C6A5"
											/>
										</svg>

										<h1>Users</h1>
									</a>
								</Link>
								<Link href={"/editbranch"}>
									<a id="nav-editbranch" className="nav-button">
										<svg
											width="56"
											height="64"
											viewBox="0 0 56 64"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g clipPath="url(#clip0_314_4242)">
												<path
													d="M0 64V16.8421H18.6667V10.1053L28 0L37.3333 10.1053V30.3158H56V64H0ZM6.22222 57.2632H12.4444V50.5263H6.22222V57.2632ZM6.22222 43.7895H12.4444V37.0526H6.22222V43.7895ZM6.22222 30.3158H12.4444V23.5789H6.22222V30.3158ZM24.8889 57.2632H31.1111V50.5263H24.8889V57.2632ZM24.8889 43.7895H31.1111V37.0526H24.8889V43.7895ZM24.8889 30.3158H31.1111V23.5789H24.8889V30.3158ZM24.8889 16.8421H31.1111V10.1053H24.8889V16.8421ZM43.5556 57.2632H49.7778V50.5263H43.5556V57.2632ZM43.5556 43.7895H49.7778V37.0526H43.5556V43.7895Z"
													fill="#14C6A5"
												/>
											</g>
											<defs>
												<clipPath id="clip0_314_4242">
													<rect width="56" height="64" fill="none" />
												</clipPath>
											</defs>
										</svg>

										<h1>Branch</h1>
									</a>
								</Link>
							</>
						) : (
							<></>
						)}
					</>
				)}
			</nav>
		</>
	);
}

export default NavBar;
