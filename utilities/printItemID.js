import jsPDF from "jspdf";

export default function printItemID(itemList) {
	console.log("ITEM LIST:", itemList);
	const docID = new jsPDF({
		orientation: "landscape",
		unit: "in",
		format: [3, 2],
	});
	docID.setFont("Courier");
	docID.setFontSize(14);

	itemList.forEach((itemInfo, index) => {
		if (index > 0) {
			docID.addPage([3, 2], "landscape");
		}
		console.log("ITEM INFO:", itemInfo);
		docID.text("Name: " + itemInfo.itemName, 0.15, 0.3, {
			maxWidth: 2.7,
			align: "left",
		});
		docID.text("ID: " + itemInfo.itemID, 0.15, 0.9, {
			maxWidth: 2.7,
			align: "left",
		});
		docID.text("Customer", 0.15, 1.6);
		docID.text("Signature ______________", 0.15, 1.8);
		// docID.text("Customer Signature:______________", 0.15, 1.6, {
		// 	maxWidth: 2.7,
		// 	align: "left",
		// });
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
