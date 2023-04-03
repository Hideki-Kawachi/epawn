import jsPDF from "jspdf";
import 'jspdf-autotable';


//add to 
export default function printReportPTData(ptData) { //data) {
        // const docPT = new jsPDF({
        //     orientation: "landscape",
        //     unit: "in",
        //     format: [8.5, 14],
        // });
        // docPT.setFont("Courier");
        // docPT.setFontSize(9);
        
        // var pageWidth = docPT.internal.pageSize.width


        // docPT.text("Header", pageWidth / 2.3, 0.5);

        // docPT.text()

    
        // const columns = ['PT-Number', 'Branch', 'Status', 'Loan Date',
        //                 'Maturity Date', 'Expiry Date', 'Amount of Loan'];
        
        // let tempData = [];

        // ptData.forEach((row) => 
        //         tempData.push([
        //             row.pawnTicketID,
        //             row.branchName,
        //             row.status,
        //             row.loanDate,
        //             row.maturityDate,
        //             row.expiryDate,
        //             row.loanAmount
        //         ])
        // );

        // docPT.autoTable({
        //     // margin: { top: 10 },
        //     head: [columns],
        //     body: tempData,
        //     startY: 1,
        // });

        

        // docPT.save("PTReport.pdf");



// Import necessary libraries

// Set up the document
const doc = new jsPDF({
  orientation: 'landscape',
  unit: 'in',
  format: [8.5, 14]
});

// Define the header function
const header = (data) => {
    doc.setFontSize(10);
    doc.setTextColor(0, 128, 0); // Change the text color to green
    doc.setFont('bold');
    doc.text('My Document', data.settings.margin.left, 0.3);
    
    // Add additional content to the header
    doc.setFontSize(12);
    doc.setFont('normal');
    doc.text('Created on: ' + new Date().toLocaleDateString(), data.settings.margin.left, 0.5);

    doc.setFontSize(10);
    doc.setTextColor(0, 128, 0); // Change the text color to green
    doc.setFont('bold');
    doc.text('My Document', data.settings.margin.left, 0.7);

    doc.setFontSize(10);
    doc.setTextColor(0, 128, 0); // Change the text color to green
    doc.setFont('bold');
    doc.text('My Document', data.settings.margin.left, 0.9);
};

// Define the footer function
const footer = (data) => {
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 0.5);
};

// Define the table data
const tableData = [
  ['Name', 'Email', 'Phone', 'Address'],
  ['John Doe', 'johndoe@example.com', '555-555-5555', '123 Main St'],
  ['Jane Doe', 'janedoe@example.com', '555-555-5555', '456 Elm St'],
  ['John Doe', 'johndoe@example.com', '555-555-5555', '123 Main St'],
  ['Jane Doe', 'janedoe@example.com', '555-555-5555', '456 Elm St'],
  ['John Doe', 'johndoe@example.com', '555-555-5555', '123 Main St'],
  ['Jane Doe', 'janedoe@example.com', '555-555-5555', '456 Elm St'],
  ['John Doe', 'johndoe@example.com', '555-555-5555', '123 Main St'],
  ['Jane Doe', 'janedoe@example.com', '555-555-5555', '456 Elm St'],
  ['John Doe', 'johndoe@example.com', '555-555-5555', '123 Main St'],
  ['Jane Doe', 'janedoe@example.com', '555-555-5555', '456 Elm St'],
  ['John Doe', 'johndoe@example.com', '555-555-5555', '123 Main St'],
  ['Jane Doe', 'janedoe@example.com', '555-555-5555', '456 Elm St'],
  ['John Doe', 'johndoe@example.com', '555-555-5555', '123 Main St'],
  ['Jane Doe', 'janedoe@example.com', '555-555-5555', '456 Elm St'],
  ['John Doe', 'johndoe@example.com', '555-555-5555', '123 Main St'],
  ['Jane Doe', 'janedoe@example.com', '555-555-5555', '456 Elm St'],
  ['John Doe', 'johndoe@example.com', '555-555-5555', '123 Main St'],
  ['Jane Doe', 'janedoe@example.com', '555-555-5555', '456 Elm St'],
  ['John Doe', 'johndoe@example.com', '555-555-5555', '123 Main St'],
  ['Jane Doe', 'janedoe@example.com', '555-555-5555', '456 Elm St'],
  ['John Doe', 'johndoe@example.com', '555-555-5555', '123 Main St'],
  ['Jane Doe', 'janedoe@example.com', '555-555-5555', '456 Elm St'],
  ['John Doe', 'johndoe@example.com', '555-555-5555', '123 Main St'],
  ['Jane Doe', 'janedoe@example.com', '555-555-5555', '456 Elm St'],
  // ... Add more rows here
];

// Add the table to the document
doc.autoTable({
  head: [tableData[0]],
  body: tableData.slice(1),
  startY: 1,
  margin: { top: 1 },
  didDrawPage: (data) => {
    header(data);
    footer(data);
  }
});

// Save the document
doc.save('my-document.pdf');



}
