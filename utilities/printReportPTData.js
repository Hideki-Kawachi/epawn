import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useGridLayout } from "react-table/dist/react-table.development";

//add to
export default function printReportPTData(
	ptData,
	startDate,
	endDate,
	ptSummaryData,
	branchID,
	status,
	printerName
) {
	// console.log(ptData);

	// Define the pt data for the table
	let tempData = [];

	let tempSummaryData = [];

	//For status filter
	let statusComparison = ptData[0].status.toString();
	let branchNameComparison = "";

	let isBranchFound = false;
	let isStatusFound = false;

	// let tempText = " - " + ptData[0].status.toString();
	let tempText = "";

	//Insert branch name for branch ID
	if (branchID.toString() == "1") {
		branchNameComparison = "Sta. Ana";
	} else if (branchID.toString() == "2") {
		branchNameComparison = "Starmall";
	} else {
		branchNameComparison = "";
	}

	if (statusComparison == status.toString()) {
		console.log("found status ");
		isBranchFound = true;
	}

	if (branchNameComparison == ptData[0].branchName) {
		console.log("found branch");
		isStatusFound = true;
	}

	//For Summary
	ptSummaryData.forEach((summ) =>
		tempSummaryData.push([
			summ.branchName,
			summ.avgLoan,
			summ.activeCount,
			summ.renewalRate,
		])
	);

	//Check if data is found
	if (isBranchFound && isStatusFound) {
		ptData.forEach((row) =>
			tempData.push([
				row.pawnTicketID,
				row.maturityDate,
				row.expiryDate,
				row.loanAmount,
			])
		);
	} else if (isBranchFound) {
		ptData.forEach((row) =>
			tempData.push([
				row.pawnTicketID,
				row.status,
				row.maturityDate,
				row.expiryDate,
				row.loanAmount,
			])
		);
	} else if (isStatusFound) {
		ptData.forEach((row) =>
			tempData.push([
				row.pawnTicketID,
				row.branchName,
				row.maturityDate,
				row.expiryDate,
				row.loanAmount,
			])
		);
	} else {
		ptData.forEach((row) =>
			tempData.push([
				row.pawnTicketID,
				row.branchName,
				row.status,
				row.maturityDate,
				row.expiryDate,
				row.loanAmount,
			])
		);
	}

	// Set up the document
	const doc = new jsPDF({
		orientation: "landscape",
		unit: "in",
		format: [8.5, 14],
	});

	// Define the header function
	const header = (data) => {
		doc.setFontSize(10);
		doc.setFont("Arial", "normal");
		doc.text("Generated By: " + printerName, 0.5, 0.3);
		doc.text("Date Generated: " + dayjs().format("MMM DD, YYYY"), 0.5, 0.5);

		doc.setFont("Arial", "bold");
		const headerText = "R. Raymundo Pawnshop Co Inc";
		const headerWidth = doc.getTextWidth(headerText);
		doc.text(
			headerText,
			doc.internal.pageSize.width / 2 - headerWidth / 2,
			0.3
		);

		doc.setFont("Arial", "normal");
		const headerText2 = "3411 New Panaderos St. Sta. Ana Manila";
		const headerWidth2 = doc.getTextWidth(headerText2);
		doc.text(
			headerText2,
			doc.internal.pageSize.width / 2 - headerWidth2 / 2,
			0.5
		);

		doc.setFont("Arial", "bold");
		const headerText3 = "PAWN TICKET REPORT" + tempText;
		const headerWidth3 = doc.getTextWidth(headerText3);
		doc.text(
			headerText3,
			doc.internal.pageSize.width / 2 - headerWidth3 / 2,
			0.7
		);

		// Add additional content to the header
		doc.setFontSize(10);
		doc.setFont("Arial", "bold");

		let headerText4;

		if (startDate != undefined || endDate != undefined) {
			headerText4 = startDate + " to " + endDate;
		} else {
			headerText4 =
				ptData[0].maturityDate + " to " + ptData[ptData.length - 1].expiryDate;
		}

		const headerWidth4 = doc.getTextWidth(headerText4);
		doc.text(
			headerText4,
			doc.internal.pageSize.width / 2 - headerWidth4 / 2,
			0.9
		);
	};

	// Define the footer function
	const footer = (data) => {
		// const pageCount = doc.internal.getNumberOfPages();
		doc.setFontSize(12);
		doc.setTextColor(40);
		const footerText = "Page " + data.pageNumber; // + " of " + pageCount;
		const footerWidth = doc.getTextWidth(footerText);
		doc.text(
			`Page ${data.pageNumber}`,
			doc.internal.pageSize.width - data.settings.margin.right - footerWidth,
			doc.internal.pageSize.height - 0.5
		);
		// doc.text(`Page ${data.pageNumber} of ${pageCount}`, doc.internal.pageSize.width - data.settings.margin.right - footerWidth, doc.internal.pageSize.height - 0.5);
	};

	let summaryTableHeader;

	summaryTableHeader = [
		["Branch Name", "Average Loan", "Active Count", "Renewal Rate"],
	];

	doc.autoTable({
		head: summaryTableHeader,
		body: tempSummaryData,
		startY: 1,
		margin: { top: 1 },
		headStyles: {
			// fillColor: "#5dbe9d", // set the background color of the header row
			halign: "center",
		},
		columnStyles: {
			1: { halign: "right" },
		},
		tableWidth: "wrap",
	});

	let tableHeader;

	//Check if data is found
	if (isBranchFound && isStatusFound) {
		tableHeader = [
			["PT-Number", "Maturity Date", "Expiry Date", "Amount of Loan"],
		];
	} else if (isBranchFound) {
		tableHeader = [
			["PT-Number", "Status", "Maturity Date", "Expiry Date", "Amount of Loan"],
		];
	} else if (isStatusFound) {
		tableHeader = [
			["PT-Number", "Branch", "Maturity Date", "Expiry Date", "Amount of Loan"],
		];
	} else {
		tableHeader = [
			[
				"PT-Number",
				"Branch",
				"Status",
				"Maturity Date",
				"Expiry Date",
				"Amount of Loan",
			],
		];
	}

	if (isBranchFound && isStatusFound) {
		doc.autoTable({
			head: tableHeader,
			body: tempData,
			startY: doc.autoTable.previous.finalY + 0.5,
			margin: { top: 1 },
			headStyles: {
				fillColor: "#5dbe9d", // set the background color of the header row
				halign: "center",
			},
			columnStyles: {
				3: { halign: "right" },
			},
			didDrawPage: (data) => {
				header(data);
				footer(data);
			},
		});
	} else if (isBranchFound || isStatusFound) {
		doc.autoTable({
			head: tableHeader,
			body: tempData,
			startY: doc.autoTable.previous.finalY + 0.5,
			margin: { top: 1 },
			headStyles: {
				fillColor: "#5dbe9d", // set the background color of the header row
				halign: "center",
			},
			columnStyles: {
				4: { halign: "right" },
			},
			didDrawPage: (data) => {
				header(data);
				footer(data);
			},
		});
	} else {
		// Add the table to the document
		doc.autoTable({
			head: tableHeader,
			body: tempData,
			startY: doc.autoTable.previous.finalY + 0.5,
			margin: { top: 1 },
			headStyles: {
				fillColor: "#5dbe9d", // set the background color of the header row
				halign: "center",
			},
			columnStyles: {
				5: { halign: "right" },
			},
			didDrawPage: (data) => {
				header(data);
				footer(data);
			},
		});
	}

	// Save the document
	let name =
		"PawnTicket_Report_" + dayjs().format("MM_DD_YYYY").toString() + ".pdf";
	doc.save(name);
}
