import React from "react";
import Close from "../closebutton";
import Image from "next/image";

function PawnDetails({ trigger, setTrigger, itemDetails }) {
	function closeModal() {
		setTrigger(!trigger);
	}

	const itemCategoryShow = {
		Gold: (
			<>
				<div className="text-right">
					<p>Category: </p>
					<p>Weight: </p>
					<p>Color: </p>
					<p>Purity: </p>
					<p>Brand: </p>
					<p>Model: </p>
					<p>Description</p>
				</div>
				<div className="ml-5 text-left">
					<p>{itemDetails.itemCategory}</p>
					<p>{itemDetails.weight} g</p>
					<p>{itemDetails.color}</p>
					<p>{itemDetails.purity} </p>
					{itemDetails.brand.length > 0 ? (
						<p>{itemDetails.brand}</p>
					) : (
						<br></br>
					)}
					{itemDetails.model.length > 0 ? (
						<p>{itemDetails.model}</p>
					) : (
						<br></br>
					)}
					{itemDetails.description.length > 0 ? (
						<p>{itemDetails.description}</p>
					) : (
						<br></br>
					)}
				</div>
			</>
		),
		Platinum: (
			<>
				<div className="text-right">
					<p>Category: </p>
					<p>Weight: </p>
					<p>Purity: </p>
					<p>Brand: </p>
					<p>Model: </p>
					<p>Description</p>
				</div>
				<div className="ml-5 text-left">
					<p>{itemDetails.itemCategory}</p>
					<p>{itemDetails.weight} g</p>
					<p>{itemDetails.purity} </p>
					{itemDetails.brand.length > 0 ? (
						<p>{itemDetails.brand}</p>
					) : (
						<br></br>
					)}
					{itemDetails.model.length > 0 ? (
						<p>{itemDetails.model}</p>
					) : (
						<br></br>
					)}
					{itemDetails.description.length > 0 ? (
						<p>{itemDetails.description}</p>
					) : (
						<br></br>
					)}
				</div>
			</>
		),
		Diamond: (
			<>
				<div className="text-right">
					<p>Category: </p>
					<p>Weight: </p>
					<p>Clarity: </p>
					<p>Color: </p>
					<p>Shape: </p>
					<p>Quantity:</p>
					<p>Description</p>
				</div>
				<div className="ml-5 text-left">
					<p>{itemDetails.itemCategory}</p>
					<p>{itemDetails.weight} g</p>
					<p>{itemDetails.clarity} </p>
					<p>{itemDetails.color}</p>
					<p>{itemDetails.shape}</p>
					<p>{itemDetails.quantity}</p>
					{itemDetails.description.length > 0 ? (
						<p>{itemDetails.description}</p>
					) : (
						<br></br>
					)}
				</div>
			</>
		),
		Others: (
			<>
				<div className="text-right">
					<p>Category: </p>
					<p>Weight: </p>
					<p>Brand: </p>
					<p>Model: </p>
					<p>Description</p>
				</div>
				<div className="ml-5 text-left">
					<p>{itemDetails.itemCategory}</p>
					<p>{itemDetails.weight} g</p>
					{itemDetails.brand.length > 0 ? (
						<p>{itemDetails.brand}</p>
					) : (
						<br></br>
					)}
					{itemDetails.model.length > 0 ? (
						<p>{itemDetails.model}</p>
					) : (
						<br></br>
					)}
					{itemDetails.description.length > 0 ? (
						<p>{itemDetails.description}</p>
					) : (
						<br></br>
					)}
				</div>
			</>
		),
	};

	return (
		<>
			<div id="modal-content-area">
				<div className="px-20 pt-5 pb-10 bg-gray-100 border-2 rounded-xl min-w-fit">
					<div className="ml-[615px] " onClick={closeModal}>
						<Close />
					</div>
					<div className="flex flex-col items-center justify-center p-2">
						<p className="mb-5 text-lg font-bold text-center font-dosis">
							Item Details
						</p>
						{itemDetails.isRedeemed ? (
							<span className="p-2 text-base font-bold text-red-500 bg-gray-200 font-nunito w-fit">
								Item Already Redeemed
							</span>
						) : (
							<></>
						)}
						{itemDetails.forAuction ? (
							<span className="p-2 text-base font-bold text-green-500 bg-green-50 font-nunito w-fit">
								Item For Auction
							</span>
						) : (
							<></>
						)}
					</div>
					<div className="flex flex-row items-end text-sm font-nunito">
						<div className="font-bold text-right">
							<p>Name: </p>
							<p>Type: </p>
							<p>Item ID: </p>
							<p>Price: </p>
						</div>
						<div className="ml-5 text-left">
							<p>{itemDetails.itemName}</p>
							<p>{itemDetails.itemType} </p>
							<p>{itemDetails.itemID}</p>
							<p>Php {itemDetails.price.toFixed(2)}</p>
						</div>
						<div className="relative object-contain w-1/3 left-1/4 aspect-square ">
							<Image
								src={itemDetails.image}
								layout={"fill"}
								priority={true}
							></Image>
						</div>
					</div>
					<hr className="h-px my-5 bg-gray-500 border-0" />
					<div className="flex flex-row text-sm font-nunito">
						{itemCategoryShow[itemDetails.itemCategory]}
					</div>
					{/* <hr className="h-px my-5 bg-gray-500 border-0" />
					<div className="flex flex-row text-sm font-nunito">
						<div className="text-right">
							<p className="font-bold">Accessories: </p>
						</div>
						<br />
						<p className="ml-10 font-bold text-gray-300 ">No Accessories</p>
					</div> */}
				</div>
			</div>
		</>
	);
}

export default PawnDetails;
