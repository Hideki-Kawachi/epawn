import jsPDF from "jspdf";
import 'jspdf-autotable';
import { useGridLayout } from "react-table/dist/react-table.development";


//add to 
export default function printReportPTData(ptData, startDate, endDate) { 
        
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


        // Set up the document
        const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [8.5, 14]
        });

        // Define the header function
        const header = (data) => {
            doc.setFontSize(10);
            doc.setFont('Arial', 'bold');
            const headerText = "R. Raymundo Pawnshop Co Inc";
            const headerWidth = doc.getTextWidth(headerText);
            doc.text( headerText, doc.internal.pageSize.width / 2 - headerWidth / 2, 0.3,);

            doc.setFont('Arial', 'normal');
            const headerText2 = "3411 New Panaderos St. Sta. Ana Manila";
            const headerWidth2 = doc.getTextWidth(headerText2);
            doc.text(headerText2, doc.internal.pageSize.width / 2 - headerWidth2 / 2, 0.5);
            
            doc.setFont('Arial', 'bold');
            const headerText3 = "CASH FLOW REPORT";
            const headerWidth3 = doc.getTextWidth(headerText3);
            doc.text(headerText3, doc.internal.pageSize.width / 2 - headerWidth3 / 2, 0.7);
            
            // Add additional content to the header
            doc.setFontSize(10);
            doc.setFont('Arial', 'bold');
            
            let headerText4;

            if (startDate != undefined || endDate != undefined) {
                headerText4 = startDate + " to " + endDate
            } else {
                headerText4 = ptData[0].loanDate + " to " + ptData[ptData.length - 1].loanDate
            } 

            const headerWidth4 = doc.getTextWidth(headerText4);
            doc.text(headerText4, doc.internal.pageSize.width / 2 - headerWidth4 / 2, 0.9);
        };

        // Define the footer function
        const footer = (data) => {
            // const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(12);
            doc.setTextColor(40);
            const footerText = "Page " + data.pageNumber // + " of " + pageCount;
            const footerWidth = doc.getTextWidth(footerText);
            doc.text(`Page ${data.pageNumber}`, doc.internal.pageSize.width - data.settings.margin.right - footerWidth, doc.internal.pageSize.height - 0.5);
            // doc.text(`Page ${data.pageNumber} of ${pageCount}`, doc.internal.pageSize.width - data.settings.margin.right - footerWidth, doc.internal.pageSize.height - 0.5);
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
            headStyles: {
                fillColor: '#5dbe9d', // set the background color of the header row  
                halign: 'center'
            },
            columnStyles: {
                6: {halign: 'right'}
            },
            didDrawPage: (data) => {
                header(data);
                footer(data);
            }
        });

        // Save the document
        doc.save('my-document.pdf');



}
