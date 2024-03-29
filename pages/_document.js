import { Html, Head, Main, NextScript } from "next/document";
import React from "react";

export default function Document() {
	return (
		<Html>
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Dosis:wght@200;400;600;800&family=Nunito:wght@200;400;600;800&display=swap"
					rel="stylesheet"
				/>
				<link rel="icon" href="/favicon.png" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
