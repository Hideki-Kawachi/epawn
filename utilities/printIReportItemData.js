import jsPDF from "jspdf";
import "jspdf-autotable";
import { useGridLayout } from "react-table/dist/react-table.development";

//add to
export default function printReportItemData(ptData, startDate, endDate) {
	// console.log(ptData);

	// Define the pt data for the table
	let tempData = [];
	let itemCatList = [];
	let itemTypeList = [];

	//row (item element inside ptData to avoid conflict instead of using name: item)
	ptData.forEach((row) => {


		//Item Category
		if ( !(itemCatList.some(obj => obj[0] == row.itemCategory) ) ) {
			itemCatList.push([
				row.itemCategory, 
				row.loanAmount
			])
			console.log("hi")
		} else {
			let index = itemCatList.findIndex(obj => obj[0] == row.itemCategory)
			let newVal = parseFloat(itemCatList[index][1]) + parseFloat(row.loanAmount)
			itemCatList[index][1] = newVal.toFixed(2)
		}


		//Item Type
		if ( !(itemTypeList.some(obj => obj[0] == row.itemType) ) ) {
			itemTypeList.push([
				row.itemType, 
				row.loanAmount
			])
			console.log("hi")
		} else {
			let index = itemTypeList.findIndex(obj => obj[0] == row.itemType)
			let newVal = parseFloat(itemTypeList[index][1]) + parseFloat(row.loanAmount)
			itemTypeList[index][1] = newVal.toFixed(2)
		}


		tempData.push([
			row.itemID,
			row.branchName,
			row.loanDate,
			row.itemType,
			row.itemCategory,
			row.itemDesc,
			row.loanAmount,
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
				ptData[0].loanDate + " to " + ptData[ptData.length - 1].loanDate;
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
	const itemCatTableHeader = [
		[
			"Item Category",
			"Amount of Loan",
		],
	];

	const itemTypeTableHeader = [
		[
			"Item Type",
			"Amount of Loan",
		],
	];

	const tableHeader = [
		[
			"Item ID",
			"Branch",
			"Loan Date",
			"Item Type",
			"Item Category",
			"Item Description",
			"Amount of Loan",
		],
	];


	//For summary
    doc.autoTable({
		head: itemCatTableHeader,
		body: itemCatList,
		startY: 1,
		margin: { top: 1 },
		headStyles: {
			// fillColor: "#5dbe9d", // set the background color of the header row
			halign: "center",
		},
		columnStyles: {
			1: { halign: "right" },
		},
	});

	doc.autoTable({
		head: itemTypeTableHeader,
		body: itemTypeList,
		startY: doc.autoTable.previous.finalY + 0.5,
		margin: { top: 1 },
		headStyles: {
			// fillColor: "#5dbe9d", // set the background color of the header row
			halign: "center",
		},
		columnStyles: {
			1: { halign: "right" },
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
			6: { halign: "right" },
		},
		didDrawPage: (data) => {
			header(data);
			footer(data);
		},
	});


	// Save the document
	doc.save("Item_Report.pdf");

	
}
