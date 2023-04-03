import jsPDF from "jspdf";
import 'jspdf-autotable';


//add to 
export default function printReportPTData(ptData) { 
        
        // Define the pt data for the table
        let tempData = [];

        ptData.forEach((row) => 
                tempData.push([
                    row.pawnTicketID,
                    row.branchName,
                    row.status,
                    row.loanDate,
                    row.maturityDate,
                    row.expiryDate,
                    row.loanAmount
                ])

        );

        ptData.forEach((row) => 
        tempData.push([
            row.pawnTicketID,
            row.branchName,
            row.status,
            row.loanDate,
            row.maturityDate,
            row.expiryDate,
            row.loanAmount
        ])

);

ptData.forEach((row) => 
tempData.push([
    row.pawnTicketID,
    row.branchName,
    row.status,
    row.loanDate,
    row.maturityDate,
    row.expiryDate,
    row.loanAmount
])

);



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
            const headerText = "My Document Header";
            const headerWidth = doc.getTextWidth(headerText);
            doc.text(doc.internal.pageSize.width / 2 - headerWidth / 2, 0.3, headerText);
            
            // Add additional content to the header
            doc.setFontSize(12);
            doc.setFont('normal');
            const headerText2 = 'Created on: ' + new Date().toLocaleDateString()
            const headerWidth2 = doc.getTextWidth(headerText2);
            doc.text(doc.internal.pageSize.width / 2 - headerWidth2 / 2, 0.5, headerText);

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
            const footerText = "Page " + data.pageNumber + " of " + pageCount;
            const footerWidth = doc.getTextWidth(footerText);
            doc.text(`Page ${data.pageNumber} of ${pageCount}`, doc.internal.pageSize.width - data.settings.margin.right - footerWidth, doc.internal.pageSize.height - 0.5);
        };

        // // Define the header data for the table
        const tableHeader = [
            ['PT-Number', 'Branch', 'Status', 'Loan Date', 'Maturity Date', 'Expiry Date', 'Amount of Loan']
        ];
        

        // Add the table to the document
        doc.autoTable({
            head: tableHeader,
            body: tempData,
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
