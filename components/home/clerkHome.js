import React from "react";
import NotificationTable from "./notificationTable";
import NotificationClerk from "../../components/tempData/notificationClerk.json";

function ClerkHome({ notifData }) {
	return (
		<div id="main-content-area">
			<p>CLERK HOME</p>
			<NotificationTable data={notifData}></NotificationTable>
		</div>
	);
}

export default ClerkHome;
