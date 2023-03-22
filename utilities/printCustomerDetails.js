import jsPDF from "jspdf";

export default function printItemID(customerDetails) {
	const docID = new jsPDF({
		orientation: "landscape",
		unit: "in",
		format: [3, 2],
	});
	docID.setFont("Courier");
	docID.setFontSize(16);

	docID.text("User ID: " + customerDetails.userID, 0.15, 0.6, {
		maxWidth: 2.7,
		align: "left",
	});
	docID.text("Password: ", 0.15, 1.2, {
		maxWidth: 2.7,
		align: "left",
	});
	docID.text(customerDetails.password, 0.15, 1.5, {
		maxWidth: 2.7,
		align: "left",
	});

	docID.autoPrint();
	// docID.output("dataurlnewwindow");

	let iframe = document.createElement("iframe");
	iframe.id = "iprint";
	iframe.name = "iprint";
	iframe.src = docID.output("bloburl");
	iframe.setAttribute("style", "display: none;");
	document.body.appendChild(iframe);
	iframe.contentWindow.print();
	// window.open(
	// 	docID.output("bloburl"),
	// 	"_blank",
	// 	"toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes,width=800,height=800"
	// );
}
