import { Router } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../components/loadingSpinner";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		localStorage.clear();
		const start = () => {
			setIsLoading(true);
		};
		const end = () => {
			setIsLoading(false);
		};
		Router.events.on("routeChangeStart", start);
		Router.events.on("routeChangeComplete", end);
		Router.events.on("routeChangeError", end);
		return () => {
			Router.events.off("routeChangeStart", start);
			Router.events.off("routeChangeComplete", end);
			Router.events.off("routeChangeError", end);
		};
	}, []);

	return (
		<>
			<LoadingSpinner isLoading={isLoading}></LoadingSpinner>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
