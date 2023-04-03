import jsPDF from "jspdf";
import 'jspdf-autotable';


//add to 
export default function printReportPTData() { //data) {
	// const docPT = new jsPDF({
	// 	orientation: "landscape",
	// 	unit: "in",
	// 	format: [8.5, 14],
	// });
	// docPT.setFont("Courier");
	// docPT.setFontSize(9);

    
        const columns = ['PT-Number', 'Branch', 'Status', 'Loan Date',
                        'Maturity Date', 'Expiry Date', 'Amount of Loan'];
        // const random = [
        //   [1, 'John Doe', 'john.doe@gmail.com', 'Active', 'Loan Date', 'Maturity Date', 'Expiry Date', 'Amount of Loan'],
        // //   [2, 'Jane Smith', 'jane.smith@yahoo.com'],
        // //   [3, 'Bob Johnson', 'bob.johnson@hotmail.com']
        // ];

        let random = [];

        random.push([1, 'John Doe', 'john.doe@gmail.com', 'Active', '0/69', 'Maturity Date', 'Expiry Date', 'Amount of Loan'])
    
        const doc = new jsPDF();
        doc.autoTable({
          head: [columns],
          body: random
        });
        doc.save('table.pdf');


    // docPT.autoPrint();




}
