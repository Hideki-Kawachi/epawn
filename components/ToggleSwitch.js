import React, { useEffect, useState } from "react";

function ToggleSwitch({ disabled, setDisabled }) {
	function switchClicked() {
		setDisabled(!disabled);
	}

	const status = {
		false: (
			<div
				className="toggle-switch-main-container-enabled"
				onClick={switchClicked}
			>
				<svg viewBox="0 0 30 23" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M28.8148 1.03679C30.3257 2.48475 30.4022 4.91062 28.9858 6.45511L14.9233 21.7884C13.5333 23.304 11.2152 23.4119 9.69616 22.0317L1.25867 14.3651C-0.289259 12.9585 -0.428686 10.5356 0.947254 8.95327C2.32319 7.37094 4.69346 7.22841 6.24139 8.63493L11.9494 13.8215L23.5142 1.21157C24.9307 -0.332925 27.3038 -0.411179 28.8148 1.03679Z"
						fill="black"
					/>
				</svg>
				<div className="toggle-switch-handle"></div>
			</div>
		),
		true: (
			<div
				className="toggle-switch-main-container-disabled"
				onClick={switchClicked}
			>
				<div className="toggle-switch-handle"></div>

				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M0.87868 0.87868C2.05025 -0.292893 3.94975 -0.292893 5.12132 0.87868L12 7.75736L18.8787 0.87868C20.0503 -0.292893 21.9497 -0.292893 23.1213 0.87868C24.2929 2.05025 24.2929 3.94975 23.1213 5.12132L16.2426 12L23.1213 18.8787C24.2929 20.0503 24.2929 21.9497 23.1213 23.1213C21.9497 24.2929 20.0503 24.2929 18.8787 23.1213L12 16.2426L5.12132 23.1213C3.94975 24.2929 2.05025 24.2929 0.87868 23.1213C-0.292893 21.9497 -0.292893 20.0503 0.87868 18.8787L7.75736 12L0.87868 5.12132C-0.292893 3.94975 -0.292893 2.05025 0.87868 0.87868Z"
						fill="black"
					/>
				</svg>
			</div>
		),
	};

	return <>{status[disabled]}</>;
}

export default ToggleSwitch;