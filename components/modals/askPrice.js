import React from "react";
import Close from "../closebutton";

function AskPrice({
	firstName,
	lastName,
	askPrice,
	setSubmitOpen,
	setSendForm,
}) {
	return (
		<>
			<div id="modal-content-area">
				<div className="px-20 pt-10 pb-10 bg-gray-100 border-2 rounded-xl min-w-fit">
					<div className="ml-[615px] mb-5" onClick={() => setSubmitOpen(false)}>
						<Close />
					</div>
					<p className="text-base text-center font-nunito">
						Are you sure you want to continue with the <b> Pawn</b> of <br />
						<b>
							{lastName}, {firstName}
						</b>{" "}
					</p>

					<p className="text-base text-center">
						For a total of <b>Php {askPrice}</b>
					</p>
					<div className="flex items-center justify-center w-full gap-10 mt-5">
						<button
							className="px-24 text-base bg-red-300 "
							onClick={() => setSubmitOpen(false)}
						>
							Cancel
						</button>
						<button
							className="px-24 text-base bg-green-300"
							onClick={() => setSendForm(true)}
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default AskPrice;
