import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PawnNav from "./pawnNav";

function NavBar() {
	//for testing
	const currentUser = {
		firstName: "Hideki",
		lastName: "Kawachi",
		middleName: "Luz",
		role: "clerk",
		branch: "Sta.Ana",
	};

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
		<nav className="fixed z-50 h-full bg-blue-500 w-fit">
			<div className="relative aspect-square">
				<Image src={"/logo_transparent.png"} layout="fill"></Image>
			</div>
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
							fill="#19947D"
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
						stroke="#19947D"
						strokeWidth="3"
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
				<h1>Pawn</h1>
				{pawnHover ? <PawnNav role={currentUser.role}></PawnNav> : <></>}
			</div>
			<Link href={"/redeem"}>
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
							fill="#19947D"
						/>
						<g clipPath="url(#clip0_48_866)">
							<path
								d="M38.1626 10H46.6426L49.4693 14L42.4026 22.6667L35.3359 14L38.1626 10Z"
								stroke="#19947D"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M43.1093 10L45.2293 14L42.4026 22.6667L39.5759 14L41.6959 10M35.3359 14H49.4693"
								stroke="#19947D"
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
			<Link href={"/renew"}>
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
							fill="#19947D"
						/>
					</svg>
					<h1>Renew</h1>
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
		</nav>
	);
}

export default NavBar;
