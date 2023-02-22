import React from "react";
import NotificationTable from "./notificationTable";
import NotificationClerk from "../../components/tempData/notificationClerk.json";

function ClerkHome() {
	return (
		<div id="main-content-area">
			<p>CLERK HOME</p>
			<NotificationTable data={NotificationClerk}></NotificationTable>
		</div>
	);
}

export default ClerkHome;
