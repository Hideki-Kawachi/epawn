import React from "react";
import Close from "../closebutton";
import { useRouter } from "next/router";

export const Cancel = ({ trigger, setTrigger, content }) => {
	const router = useRouter();
	function closeModal() {
		setTrigger(!trigger);
	}

	return (
		<>
			<div id="modal-content-area">
				<div className="flex flex-col items-center justify-center px-20 pt-10 pb-10 bg-gray-100 border-2 rounded-xl min-w-fit">
					<div className="ml-[615px] mb-5" onClick={closeModal}>
						<Close />
					</div>
					<p className="text-base text-center font-nunito">{content}</p>
					<div className="flex gap-10 mt-10">
						<button
							className="px-24 text-base bg-green-300"
							onClick={closeModal}
						>
							Back
						</button>
						<button
							className="px-24 text-base bg-red-300"
							onClick={() => router.push("/")}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Cancel;
