import { data } from "autoprefixer";
import React from "react";
import NotificationTable from "./notificationTable";

function ManagerHome({ notifData }) {
	return (
		<div id="main-content-area">
			<p>MANAGER HOME</p>
			<NotificationTable role={"manager"} data={notifData}></NotificationTable>
		</div>
	);
}

export default ManagerHome;
