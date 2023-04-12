import React from "react";
import NotificationTable from "./notificationTable";
import NotificationClerk from "../../components/tempData/notificationClerk.json";
import dayjs from "dayjs";
import { useState, useEffect } from "react";


function ClerkHome({ notifData }) {


	return (
    <div id="main-content-area">
      <NotificationTable role={"clerk"} data={notifData}></NotificationTable>
    </div>
  );
}

export default ClerkHome;
