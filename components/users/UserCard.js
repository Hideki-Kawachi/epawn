import React, { useEffect, useRef, useState } from "react";
import ToggleSwitch from "../ToggleSwitch";

function UserCard({
	userID,
	lastName,
	firstName,
	roleName,
	disabled,
	setEditing,
	setViewing,
}) {
	const [isDisabled, setIsDisabled] = useState(disabled);

	function showDisabled() {
		if (isDisabled) {
			return (
				<div className="status-container-disabled">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0.87868 0.87868C2.05025 -0.292893 3.94975 -0.292893 5.12132 0.87868L12 7.75736L18.8787 0.87868C20.0503 -0.292893 21.9497 -0.292893 23.1213 0.87868C24.2929 2.05025 24.2929 3.94975 23.1213 5.12132L16.2426 12L23.1213 18.8787C24.2929 20.0503 24.2929 21.9497 23.1213 23.1213C21.9497 24.2929 20.0503 24.2929 18.8787 23.1213L12 16.2426L5.12132 23.1213C3.94975 24.2929 2.05025 24.2929 0.87868 23.1213C-0.292893 21.9497 -0.292893 20.0503 0.87868 18.8787L7.75736 12L0.87868 5.12132C-0.292893 3.94975 -0.292893 2.05025 0.87868 0.87868Z"
							fill="black"
						/>
					</svg>
				</div>
			);
		} else {
			return (
				<div className="status-container-enabled">
					<svg
						viewBox="0 0 200 200"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M28.8148 1.03679C30.3257 2.48475 30.4022 4.91062 28.9858 6.45511L14.9233 21.7884C13.5333 23.304 11.2152 23.4119 9.69616 22.0317L1.25867 14.3651C-0.289259 12.9585 -0.428686 10.5356 0.947254 8.95327C2.32319 7.37094 4.69346 7.22841 6.24139 8.63493L11.9494 13.8215L23.5142 1.21157C24.9307 -0.332925 27.3038 -0.411179 28.8148 1.03679Z"
							fill="black"
						/>
					</svg>
				</div>
			);
		}
	}

	return (
		<div className="user-card-main-container">
			<div className="text-container">
				<span style={{ fontWeight: 700 }} onClick={() => setViewing(userID)}>
					{lastName}, {firstName}
				</span>
				<span style={{ fontSize: "18px", fontWeight: 300 }}>{roleName}</span>
			</div>
			<div className="buttons-container">
				{showDisabled()}
				<svg
					className="edit-button"
					viewBox="0 0 300 150"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					onClick={() => setEditing(userID)}
				>
					<path
						d="M32.0833 0H13.75C6.16688 0 0 5.49412 0 12.25V38.7917C0 39.3331 0.241443 39.8525 0.671214 40.2353C1.10098 40.6182 1.68388 40.8333 2.29167 40.8333H32.0833C39.6665 40.8333 45.8333 35.3392 45.8333 28.5833V12.25C45.8333 5.49412 39.6665 0 32.0833 0ZM16.0394 30.625H11.4583V26.5437L24.1313 15.2696L28.7123 19.3509L16.0394 30.625ZM30.8733 17.4256L26.2923 13.3443L29.7848 10.2349L34.3658 14.3162L30.8733 17.4256Z"
						fill="black"
					/>
				</svg>
			</div>
		</div>
	);
}

export default UserCard;