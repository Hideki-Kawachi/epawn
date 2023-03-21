import React from "react";
import Image from "next/image";
function CustomerHeader() {
	return (
		<div className="flex flex-col items-center justify-center w-full pb-5 bg-white">
			<div className="aspect-[30/18] relative w-1/3">
				<Image src="/logo_transparent.png" layout="fill"></Image>
			</div>
			<span className="text-lg font-bold font-dosis">ePawn</span>
			<span className="text-sm font-dosis">Treasured to Last</span>
		</div>
	);
}

export default CustomerHeader;
