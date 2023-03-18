import jsPDF from "jspdf";

export default function printPawnTicket(pawnTicketInfo) {
	const docPT = new jsPDF({
		orientation: "landscape",
		unit: "in",
		format: [8.5, 5.5],
	});
	docPT.setFont("Courier");
	docPT.setFontSize(8);
	docPT.text(pawnTicketInfo.pawnTicketID, 0.5, 0.75);
	docPT.text(pawnTicketInfo.customerName, 2.2, 1.15, { maxWidth: 2.5 });
	docPT.text(pawnTicketInfo.address, 0.7, 1.7, { maxWidth: 3.5 });
	docPT.text(pawnTicketInfo.appraisalValue, 2.5, 2.8);
	docPT.text(pawnTicketInfo.loanDate, 2.5, 3.15);
	docPT.text(pawnTicketInfo.maturityDate, 2.5, 3.5);
	docPT.text(pawnTicketInfo.expiryDate, 2.5, 3.85);
	docPT.text(pawnTicketInfo.itemDescription, 0.75, 4.4, { maxWidth: 6.5 });
	docPT.text(pawnTicketInfo.loanAmount, 7.6, 1.15, {
		maxWidth: 1.15,
		align: "right",
	});
	docPT.text(pawnTicketInfo.interest, 7.6, 1.5, {
		maxWidth: 1.15,
		align: "right",
	});
	docPT.text(pawnTicketInfo.netProceeds, 7.6, 2.5, {
		maxWidth: 1.15,
		align: "right",
	});
	docPT.text("Nominal Rate", 5, 2.75);
	docPT.text("3.5%", 7.3, 2.75);
	docPT.text("3.6%", 7.3, 3.2);
	docPT.text("X", 6.6, 3.4);
	docPT.text("1.0%", 7.3, 3.8);
	docPT.text(pawnTicketInfo.clerkID, 7.25, 4.8);
	docPT.autoPrint();

	let iframe = document.createElement("iframe");
	iframe.id = "iprint";
	iframe.name = "iprint";
	iframe.src = docPT.output("bloburl");
	iframe.setAttribute("style", "display: none;");
	document.body.appendChild(iframe);
	iframe.contentWindow.print();
	// window.open(
	// 	docPT.output("bloburl"),
	// 	"_blank",
	// 	"toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes,width=800,height=800"
	// );
}
