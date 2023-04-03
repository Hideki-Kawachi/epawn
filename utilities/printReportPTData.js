import jsPDF from "jspdf";
import 'jspdf-autotable';


//add to 
export default function printReportPTData(data) { //data) {
        const docPT = new jsPDF({
            orientation: "landscape",
            unit: "in",
            format: [8.5, 14],
        });
        docPT.setFont("Courier");
        docPT.setFontSize(9);

        // Define the header and footer

        docPT.text("Header", 20, 10);

        // var header = function() {
        //     docPT.text("This is the header.", 20, 10);
        // };
        // var footer = function() {
        //     docPT.text("This is the footer.", 20, docPT.internal.pageSize.height - 10);
        // };

    
        const columns = ['PT-Number', 'Branch', 'Status', 'Loan Date',
                        'Maturity Date', 'Expiry Date', 'Amount of Loan'];
        
        let tempData = [];

        data.forEach((row) => 
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

        docPT.autoTable({
            head: [columns],
            body: tempData,
        });

        docPT.save("PTReport.pdf");

        // const random = [
        //   [1, 'John Doe', 'john.doe@gmail.com', 'Active', 'Loan Date', 'Maturity Date', 'Expiry Date', 'Amount of Loan'],
        // //   [2, 'Jane Smith', 'jane.smith@yahoo.com'],
        // //   [3, 'Bob Johnson', 'bob.johnson@hotmail.com']
        // ];

        // let tempData = [];

        // tempData.push([1, 'John Doe', 'john.doe@gmail.com', 'Active', '0/69', 'Maturity Date', 'Expiry Date', 'Amount of Loan'])
    
        // const doc = new jsPDF();
        // doc.autoTable({
        //   head: [columns],
        //   body: tempData
        // });
        // doc.save('table.pdf');


        // docPT.autoPrint();




}
