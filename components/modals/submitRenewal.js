import React from "react";
import Close from "../closebutton";
import ItemCard from "../itemcard";
import { useRouter } from "next/router";

export const Submit = ({
	trigger,
	setTrigger,
	mode,
	PTnumber,
	itemList,
	changeMode,
	setSendForm,
	amountToPay,
}) => {
	const router = useRouter();
	function closeModal() {
		setTrigger(!trigger);
	}

	function modeChange() {
		changeMode(!mode);
		setTrigger(!trigger);
	}

	function goForm() {
		setSendForm(true);
	}
	function convertFloat(number) {
		if (mode) return "0.00";
		else {
			return Number(number).toLocaleString("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		}
	}

	return (
		<>
			<div id="modal-content-area">
				<div className="px-20 pt-10 pb-10 bg-gray-100 border-2 rounded-xl min-w-fit">
					<div className="ml-[750px] mb-5" onClick={closeModal}>
						<Close />
					</div>
					{mode == true ? (
						<p className="mb-5 text-base text-center font-nunito">
							Select <b>Pawn Ticket {PTnumber}</b> <br /> with the following
							items?
						</p>
					) : (
						<p className="mb-5 text-base text-center font-nunito">
							Are you sure you want to continue with the <b> Renewal </b> of{" "}
							<br />
							<b>Pawn Ticket {PTnumber}</b> of items:{" "}
						</p>
					)}

					<div className="p-5 mx-10 w-[720px] h-96  overflow-y-scroll bg-white border-2">
						{itemList.map((items) => (
							<div className="flex flex-row" key={items.itemID}>
								<ItemCard key={items.itemID} itemDetails={items}></ItemCard>
							</div>
						))}
					</div>
					{mode == false ? (
						<p className="text-base text-center">
							For a total of <b>Php {convertFloat(amountToPay)}</b>
						</p>
					) : (
						<> </>
					)}
					<div className="flex flex-row justify-center gap-10 mt-8">
						<button className="text-base bg-red-300" onClick={closeModal}>
							Cancel
						</button>
						{mode == true ? (
							<button className="text-base bg-green-300" onClick={modeChange}>
								Select
							</button>
						) : (
							<button className="text-base bg-green-300" onClick={goForm}>
								Submit
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Submit;
