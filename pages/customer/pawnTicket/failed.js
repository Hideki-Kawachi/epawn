import React, { useEffect } from "react";

function Failed() {
	useEffect(() => {
		//get payment status
		const options2 = {
			method: "GET",
			headers: {
				accept: "application/json",
				authorization: "Basic c2tfdGVzdF9kaUVONlRCeXBRVlNScEhzcFBWQlhuaUQ=",
			},
		};
		let sourceID = localStorage.getItem("sourceID");
		localStorage.clear();

		fetch("https://api.paymongo.com/v1/sources/" + sourceID, options2)
			.then((response) => response.json())
			.then((response) => {
				console.log("resres", response);
			})
			.catch((err) => console.error(err));
	}, []);
	return (
		<div>
			<span>FAILED</span>
		</div>
	);
}

export default Failed;
