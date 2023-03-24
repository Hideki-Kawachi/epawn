import jsPDF from "jspdf";

export default function printItemID(receiptData) {
	const docOR = new jsPDF({
		orientation: "portrait",
		unit: "in",
		format: [5.5, 4.25],
	});
	docOR.setFont("Courier");
	docOR.setFontSize(6);

	docOR.text(receiptData.date, 3, 1.4);
	docOR.text(receiptData.customerName, 1.1, 1.5);
	docOR.text(receiptData.address, 0.75, 2.1, { maxWidth: 2.75 });
	docOR.text(receiptData.totalWords, 0.85, 2.25, { maxWidth: 2.55 });
	docOR.text(receiptData.total, 0.5, 2.4);
	docOR.text(receiptData.pawnTicketID, 2.25, 2.9, { align: "right" });
	docOR.text(receiptData.principal, 2.25, 3.1, { align: "right" });
	docOR.text(receiptData.interest, 2.25, 3.25, { align: "right" });
	docOR.text("0.00", 2.25, 3.4, { align: "right" });
	docOR.text("0.00", 2.25, 3.55, { align: "right" });
	docOR.text(receiptData.total, 2.25, 4.3, { align: "right" });
	docOR.autoPrint();
	// docOR.output("dataurlnewwindow");

	let iframe = document.createElement("iframe");
	iframe.id = "iprint";
	iframe.name = "iprint";
	iframe.src = docOR.output("bloburl");
	iframe.setAttribute("style", "display: none;");
	document.body.appendChild(iframe);
	iframe.contentWindow.print();
	// window.open(
	// 	docOR.output("bloburl"),
	// 	"_blank",
	// 	"toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes,width=800,height=800"
	// );
}
