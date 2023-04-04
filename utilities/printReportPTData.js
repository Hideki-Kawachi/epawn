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


        // Set up the document
        const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [8.5, 14]
        });

        // Define the header function
        const header = (data) => {
            doc.setFontSize(10);
            doc.setFont('bold');
            doc.setText
            const headerText = "R. Raymundo Pawnshop Co Inc";
            const headerWidth = doc.getTextWidth(headerText);
            doc.text(doc.internal.pageSize.width / 2 - headerWidth / 2, 0.3, headerText);

            
            doc.setFontSize(10);
            doc.setFont('bold');
            const headerText2 = "3411 New Panaderos St. Sta. Ana Manila";
            const headerWidth2 = doc.getTextWidth(headerText2);
            doc.text(headerText2, doc.internal.pageSize.width / 2 - headerWidth2 / 2, 0.5);

            doc.setFontSize(10);
            // doc.setTextColor(0, 128, 0); // Change the text color to green
            doc.setFont('bold');
            const headerText3 = "R. Raymundo Pawnshop Co Inc";
            const headerWidth3 = doc.getTextWidth(headerText3);
            doc.text(headerText3, doc.internal.pageSize.width / 2 - headerWidth3 / 2, 0.7);
            
            // Add additional content to the header
            doc.setFontSize(12);
            doc.setFont('normal');
            const headerText4 = ptData[0].loanDate + ""
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
            didDrawPage: (data) => {
                header(data);
                footer(data);
            }
        });

        // Save the document
        doc.save('my-document.pdf');



}
