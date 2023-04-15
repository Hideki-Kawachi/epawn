import jsPDF from "jspdf";
import "jspdf-autotable";
import { useGridLayout } from "react-table/dist/react-table.development";

//add to
export default function printReportPTData(
	ptData,
	startDate,
	endDate,
	ptSummaryData
) {
	// console.log(ptData);

	// Define the pt data for the table
	let tempData = [];

	let tempSummaryData = [];

	//For status filter
	let compVal = ptData[0].status.toString();
	let isFound = false;
	let tempText = " - " + ptData[0].status.toString();

	ptSummaryData.forEach((summ) =>
		tempSummaryData.push([
			summ.branchName,
			summ.avgLoan,
			summ.activeCount,
			summ.renewalRate,
		])
	);

	console.log(tempSummaryData);

	ptData.forEach((row) => {
		if (row.status != compVal) {
			isFound = true;
			tempText = "";
		}
	});

	if (isFound) {
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
	} else {
		ptData.forEach((row) =>
			tempData.push([
				row.pawnTicketID,
				row.branchName,
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

	// // Define the header data for the table
	if (!isFound) {
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

	if (!isFound) {
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
				6: { halign: "right" },
			},
			didDrawPage: (data) => {
				header(data);
				footer(data);
			},
		});
	}

	// Save the document
	doc.save("PT_Report.pdf");
}
