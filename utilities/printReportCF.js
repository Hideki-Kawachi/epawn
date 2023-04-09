import jsPDF from "jspdf";
import "jspdf-autotable";
import { useGridLayout } from "react-table/dist/react-table.development";

//add to
export default function printReportCF(cfData, startDate, endDate) {
	// console.log(ptData);

	// Define the pt data for the table
	let tempData = [];
	let branchList = [];

	//row (item element inside ptData to avoid conflict instead of using name: item)
	cfData.forEach((row) => {

		if ( !(branchList.some(obj => obj[0] == row.branchName) ) ) {
			branchList.push([
				row.branchName, 
				row.cashInAmount,
				row.cashOutAmount,
				row.netCashFlow
			])

			// console.log("hi")
		} else {

			let index = branchList.findIndex((obj) => obj[0] == row.branchName)
			let newCashIn = parseFloat(branchList[index][1]) + parseFloat(row.cashInAmount)

			let newCashOut =  parseFloat(branchList[index][2]) + parseFloat(row.cashOutAmount)
				
			branchList[index][1] = newCashIn.toFixed(2)
			branchList[index][2] = newCashOut.toFixed(2)

			let newVal = parseFloat(branchList[index][3]) + parseFloat(row.netCashFlow) 
			
			branchList[index][3] = newVal.toFixed(2)
		}


		tempData.push([
			row.branchName,
			row.transactDate,
			row.cashInAmount,
			row.cashOutAmount,
			row.netCashFlow,
		])

	});





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
		const headerText3 = "ITEM REPORT";
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
				cfData[0].transactDate + " to " + cfData[cfData.length - 1].transactDate;
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

	// // Define the header data for the table
	const cfTableHeader = [
		[
			"Branch",
			"Total Cash In",
			"Total Cash Out",
			"Total Net Cash Flow"
		],
	];

	const tableHeader = [
		[
			"Branch",
			"Date",
			"Cash In",
			"Cash Out",
			"Net Cash Flow"
		],
	];


	//For summary
    doc.autoTable({
		head: cfTableHeader,
		body: branchList,
		startY: 1,
		margin: { top: 1 },
		headStyles: {
			// fillColor: "#5dbe9d", // set the background color of the header row
			halign: "center",
		},
		columnStyles: {
			1: { halign: "right" },
			2: { halign: "right" },
			3: { halign: "right" },
		},
	});

	//Real table
	// Add the table to the document
	doc.autoTable({
		head: tableHeader,
		body: tempData,
		startY:  doc.autoTable.previous.finalY + 0.5,
		margin: { top: 1 },
		headStyles: {
			fillColor: "#5dbe9d", // set the background color of the header row
			halign: "center",
		},
		columnStyles: {
			2: { halign: "right" },
			3: { halign: "right" },
			4: { halign: "right" }
		},
		didDrawPage: (data) => {
			header(data);
			footer(data);
		},
	});


	// Save the document
	doc.save("CashFlow_Report.pdf");

	
}
